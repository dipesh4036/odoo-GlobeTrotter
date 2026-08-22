import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cityId, category, maxCost } = req.query;
    
    const where: any = {};
    if (cityId && typeof cityId === 'string') {
      where.cityId = cityId;
    }
    if (category && typeof category === 'string') {
      where.category = category;
    }
    if (maxCost && typeof maxCost === 'string') {
      const parsedCost = parseFloat(maxCost);
      if (!isNaN(parsedCost)) {
        where.cost = { lte: parsedCost };
      }
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: { popularity: 'desc' },
      take: 30,
      include: {
        city: {
          select: { name: true }
        }
      }
    });

    res.status(200).json(activities);
  } catch (error) {
    console.error('getActivities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
