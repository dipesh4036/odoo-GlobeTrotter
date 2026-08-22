import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, country } = req.query;
    
    const where: any = {};
    if (search && typeof search === 'string') {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (country && typeof country === 'string') {
      where.country = country; // Exact match
    }

    const cities = await prisma.city.findMany({
      where,
      orderBy: { popularity: 'desc' },
      take: 20
    });

    res.status(200).json(cities);
  } catch (error) {
    console.error('getCities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
