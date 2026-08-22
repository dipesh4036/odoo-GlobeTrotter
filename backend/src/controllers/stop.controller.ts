import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createStopSchema, updateStopSchema, reorderStopsSchema } from '../schemas/stop.schema';

export const createStop = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    
    const tripId = req.params.id;
    const trip = await prisma.trip.findUnique({ where: { id: tripId }});
    if (!trip) { res.status(404).json({ error: 'Trip not found' }); return; }
    if (trip.userId !== req.user.userId) { res.status(403).json({ error: 'Forbidden' }); return; }

    const parsed = createStopSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Validation failed', details: parsed.error.errors }); return; }
    
    const data = parsed.data;
    
    const sDate = new Date(data.startDate);
    const eDate = new Date(data.endDate);
    if (sDate < trip.startDate || eDate > trip.endDate) {
      res.status(400).json({ error: 'Stop dates must fall within trip date range' }); return;
    }

    const maxOrderAgg = await prisma.stop.aggregate({
      where: { tripId },
      _max: { order: true }
    });
    const nextOrder = (maxOrderAgg._max.order ?? 0) + 1;

    const newStop = await prisma.stop.create({
      data: {
        tripId,
        cityId: data.cityId,
        startDate: sDate,
        endDate: eDate,
        budget: data.budget,
        order: nextOrder
      },
      include: { city: true }
    });

    res.status(201).json(newStop);
  } catch (error) {
    console.error('createStop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateStop = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    
    const { id } = req.params;
    const existingStop = await prisma.stop.findUnique({ where: { id }, include: { trip: true } });
    if (!existingStop) { res.status(404).json({ error: 'Stop not found' }); return; }
    if (existingStop.trip.userId !== req.user.userId) { res.status(403).json({ error: 'Forbidden' }); return; }

    const parsed = updateStopSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Validation failed', details: parsed.error.errors }); return; }
    
    const data = parsed.data;
    const updateData: any = {};
    if (data.cityId !== undefined) updateData.cityId = data.cityId;
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
    if (data.budget !== undefined) updateData.budget = data.budget;

    const updatedStop = await prisma.stop.update({
      where: { id },
      data: updateData,
      include: { city: true }
    });
    res.status(200).json(updatedStop);
  } catch (error) {
    console.error('updateStop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteStop = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    
    const { id } = req.params;
    const existingStop = await prisma.stop.findUnique({ where: { id }, include: { trip: true } });
    if (!existingStop) { res.status(404).json({ error: 'Stop not found' }); return; }
    if (existingStop.trip.userId !== req.user.userId) { res.status(403).json({ error: 'Forbidden' }); return; }

    await prisma.stop.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('deleteStop error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const reorderStops = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    
    const tripId = req.params.id;
    const trip = await prisma.trip.findUnique({ where: { id: tripId }, include: { stops: true } });
    if (!trip) { res.status(404).json({ error: 'Trip not found' }); return; }
    if (trip.userId !== req.user.userId) { res.status(403).json({ error: 'Forbidden' }); return; }

    const parsed = reorderStopsSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Validation failed', details: parsed.error.errors }); return; }
    
    const { stopIds } = parsed.data;
    
    const validStopIds = trip.stops.map(s => s.id);
    const isValid = stopIds.every(id => validStopIds.includes(id));
    if (!isValid || stopIds.length !== validStopIds.length) {
      res.status(400).json({ error: 'Invalid stop IDs provided' }); return;
    }

    const transactions = stopIds.map((id, index) => 
      prisma.stop.update({
        where: { id },
        data: { order: index + 1 }
      })
    );
    
    await prisma.$transaction(transactions);
    
    const updatedStops = await prisma.stop.findMany({ where: { tripId }, orderBy: { order: 'asc' }, include: { city: true } });
    res.status(200).json(updatedStops);
  } catch (error) {
    console.error('reorderStops error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
