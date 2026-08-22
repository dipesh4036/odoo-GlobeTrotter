import type { Request, Response } from 'express';
import crypto from 'crypto';
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

export const cancelTrip = async (req: Request, res: Response): Promise<void> => {
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

    if (existingTrip.status === TripStatus.CANCELLED || existingTrip.status === TripStatus.COMPLETED) {
      res.status(409).json({ error: `Cannot cancel a trip that is already ${existingTrip.status}` });
      return;
    }

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: { status: TripStatus.CANCELLED }
    });

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error('Cancel trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTripBudget = async (req: Request, res: Response): Promise<void> => {
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
              include: { activity: true }
            }
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

    let total = 0;
    const byDayMap = new Map<number, number>();
    const byCategoryMap = new Map<string, number>();
    const byStopMap = new Map<string, { cityName: string, total: number }>();

    for (const stop of trip.stops) {
      let stopTotal = 0;
      for (const sa of stop.activities) {
        const cost = sa.cost;
        total += cost;
        stopTotal += cost;
        
        byDayMap.set(sa.dayNumber, (byDayMap.get(sa.dayNumber) || 0) + cost);
        
        const cat = sa.activity.category;
        byCategoryMap.set(cat, (byCategoryMap.get(cat) || 0) + cost);
      }
      byStopMap.set(stop.id, { cityName: stop.city.name, total: stopTotal });
    }

    const byDay = Array.from(byDayMap.entries())
      .map(([dayNumber, total]) => ({ dayNumber, total }))
      .sort((a,b) => a.dayNumber - b.dayNumber);
      
    const byCategory = Array.from(byCategoryMap.entries())
      .map(([category, total]) => ({ category, total }));
      
    const byStop = Array.from(byStopMap.entries())
      .map(([stopId, data]) => ({ stopId, cityName: data.cityName, total: data.total }));

    res.status(200).json({ total, byDay, byCategory, byStop });
  } catch (error) {
    console.error('Get trip budget error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTripCalendar = async (req: Request, res: Response): Promise<void> => {
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
          include: { city: true },
          orderBy: { order: 'asc' }
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

    const stops = trip.stops.map(s => ({
      stopId: s.id,
      cityName: s.city.name,
      startDate: s.startDate,
      endDate: s.endDate
    }));

    res.status(200).json({
      startDate: trip.startDate,
      endDate: trip.endDate,
      stops
    });
  } catch (error) {
    console.error('Get trip calendar error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const generateSlug = (name: string): string => {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const randomStr = crypto.randomBytes(5).toString('hex');
  return `${base}-${randomStr}`;
};

export const publishTrip = async (req: Request, res: Response): Promise<void> => {
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

    let publicSlug = existingTrip.publicSlug;

    if (!publicSlug) {
      let isUnique = false;
      while (!isUnique) {
        publicSlug = generateSlug(existingTrip.name);
        const collision = await prisma.trip.findUnique({ where: { publicSlug } });
        if (!collision) {
          isUnique = true;
        }
      }
    }

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: { isPublic: true, publicSlug }
    });

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error('Publish trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadCoverPhotoController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    if (!req.file) {
      res.status(400).json({ error: 'No cover photo file provided or invalid type/size.' });
      return;
    }

    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) {
      res.status(404).json({ error: 'Trip not found' });
      return;
    }

    if (trip.userId !== req.user.userId) {
      res.status(403).json({ error: 'Forbidden: You do not own this trip' });
      return;
    }

    const coverPhotoUrl = `/uploads/covers/${req.file.filename}`;

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: { coverPhotoUrl }
    });

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.error('Upload cover photo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
