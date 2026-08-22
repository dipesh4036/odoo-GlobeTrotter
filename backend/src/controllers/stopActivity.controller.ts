import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createStopActivitySchema, reorderStopActivitiesSchema } from '../schemas/stopActivity.schema';

export const createStopActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    
    const stopId = req.params.id;
    const stop = await prisma.stop.findUnique({ where: { id: stopId }, include: { trip: true } });
    if (!stop) { res.status(404).json({ error: 'Stop not found' }); return; }
    if (stop.trip.userId !== req.user.userId) { res.status(403).json({ error: 'Forbidden' }); return; }

    const parsed = createStopActivitySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Validation failed', details: parsed.error.errors }); return; }
    
    const data = parsed.data;

    const activity = await prisma.activity.findUnique({ where: { id: data.activityId } });
    if (!activity) { res.status(404).json({ error: 'Activity not found' }); return; }

    const maxOrderAgg = await prisma.stopActivity.aggregate({
      where: { stopId, dayNumber: data.dayNumber },
      _max: { order: true }
    });
    const nextOrder = (maxOrderAgg._max.order ?? 0) + 1;

    const newSA = await prisma.stopActivity.create({
      data: {
        stopId,
        activityId: data.activityId,
        dayNumber: data.dayNumber,
        order: nextOrder,
        cost: activity.cost
      },
      include: { activity: true }
    });

    res.status(201).json(newSA);
  } catch (error) {
    console.error('createStopActivity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteStopActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    
    const { id } = req.params;
    const sa = await prisma.stopActivity.findUnique({ where: { id }, include: { stop: { include: { trip: true } } } });
    if (!sa) { res.status(404).json({ error: 'StopActivity not found' }); return; }
    if (sa.stop.trip.userId !== req.user.userId) { res.status(403).json({ error: 'Forbidden' }); return; }

    await prisma.stopActivity.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error('deleteStopActivity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const reorderStopActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    
    const parsed = reorderStopActivitiesSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Validation failed', details: parsed.error.errors }); return; }
    const data = parsed.data;

    const stop = await prisma.stop.findUnique({ where: { id: data.stopId }, include: { trip: true, activities: { where: { dayNumber: data.dayNumber } } } });
    if (!stop) { res.status(404).json({ error: 'Stop not found' }); return; }
    if (stop.trip.userId !== req.user.userId) { res.status(403).json({ error: 'Forbidden' }); return; }

    const validIds = stop.activities.map(a => a.id);
    const isValid = data.activityIds.every(id => validIds.includes(id));
    if (!isValid || data.activityIds.length !== validIds.length) {
      res.status(400).json({ error: 'Invalid activity IDs provided' }); return;
    }

    const transactions = data.activityIds.map((id, index) => 
      prisma.stopActivity.update({
        where: { id },
        data: { order: index + 1 }
      })
    );
    
    await prisma.$transaction(transactions);
    
    res.status(200).json({ message: 'Reordered successfully' });
  } catch (error) {
    console.error('reorderStopActivities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
