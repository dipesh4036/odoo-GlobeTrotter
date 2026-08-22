import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createTripSchema, updateTripSchema } from '../schemas/trip.schema';
import { TripStatus } from '@prisma/client';

export const createTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const parsed = createTripSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
      return;
    }

    const data = parsed.data;

    const newTrip = await prisma.trip.create({
      data: {
        userId: req.user.userId,
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        coverPhotoUrl: data.coverPhotoUrl,
        status: TripStatus.UPCOMING,
        isPublic: false
      }
    });

    res.status(201).json(newTrip);
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTrips = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    let statusFilter: TripStatus | undefined;
    if (req.query.status) {
      const statusStr = String(req.query.status).toUpperCase();
      if (Object.values(TripStatus).includes(statusStr as TripStatus)) {
        statusFilter = statusStr as TripStatus;
      } else {
        res.status(400).json({ error: 'Invalid status parameter' });
        return;
      }
    }

    const trips = await prisma.trip.findMany({
      where: {
        userId: req.user.userId,
        status: statusFilter
      },
      orderBy: {
        startDate: 'desc'
      },
      include: {
        _count: {
          select: { stops: true }
        }
      }
    });

    res.status(200).json(trips);
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTripById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        stops: {
          include: {
            city: true,
            activities: {
              include: {
                activity: true
              },
              orderBy: [
                { dayNumber: 'asc' },
                { order: 'asc' }
              ]
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    if (trip.userId !== req.user.userId) {
      res.status(403).json({ error: 'Forbidden: You do not own this trip' });
      return;
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error('Get trip by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const existingTrip = await prisma.trip.findUnique({ where: { id } });
    if (!existingTrip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    if (existingTrip.userId !== req.user.userId) {
      res.status(403).json({ error: 'Forbidden: You do not own this trip' });
      return;
    }

    const parsed = updateTripSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
      return;
    }

    const data = parsed.data;
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
    if (data.coverPhotoUrl !== undefined) updateData.coverPhotoUrl = data.coverPhotoUrl;
    if (data.status !== undefined) updateData.status = data.status;

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: updateData
    });

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTrip = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const existingTrip = await prisma.trip.findUnique({ where: { id } });
    if (!existingTrip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    if (existingTrip.userId !== req.user.userId) {
      res.status(403).json({ error: 'Forbidden: You do not own this trip' });
      return;
    }

    await prisma.trip.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
