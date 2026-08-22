import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { TripStatus } from '@prisma/client';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { trips: true }
        }
      }
    });

    const safeUsers = users.map(user => {
      const { passwordHash, ...safeUser } = user;
      return safeUser;
    });

    res.status(200).json(safeUsers);
  } catch (error) {
    console.error('Admin getUsers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPopularCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const cities = await prisma.city.findMany({
      orderBy: { popularity: 'desc' },
      take: 10
    });
    res.status(200).json(cities);
  } catch (error) {
    console.error('Admin getPopularCities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPopularActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { popularity: 'desc' },
      take: 10
    });
    res.status(200).json(activities);
  } catch (error) {
    console.error('Admin getPopularActivities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTrends = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await prisma.user.count();

    const statusCounts = await prisma.trip.groupBy({
      by: ['status'],
      _count: { status: true }
    });
    
    const statusDistribution = statusCounts.map(item => ({
      name: item.status,
      value: item._count.status
    }));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTrips = await prisma.trip.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo }
      },
      select: { createdAt: true }
    });

    const tripsPerDayMap = new Map<string, number>();
    for (const trip of recentTrips) {
      const dateStr = trip.createdAt.toISOString().split('T')[0];
      tripsPerDayMap.set(dateStr, (tripsPerDayMap.get(dateStr) || 0) + 1);
    }

    const tripsPerDay = Array.from(tripsPerDayMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.status(200).json({
      totalUsers,
      statusDistribution,
      tripsPerDay
    });
  } catch (error) {
    console.error('Admin getTrends error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
