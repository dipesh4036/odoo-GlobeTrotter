import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createTripSchema } from '../schemas/trip.schema';
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
