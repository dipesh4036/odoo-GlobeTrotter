import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';
import { updateProfileSchema, saveDestinationSchema } from '../schemas/user.schema';

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: parsed.data,
    });

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const saveDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    const parsed = saveDestinationSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Validation failed', details: parsed.error.errors }); return; }
    
    const { cityId } = parsed.data;
    const record = await prisma.savedDestination.create({
      data: { userId: req.user.userId, cityId }
    });
    res.status(201).json(record);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      res.status(409).json({ error: 'Destination already saved' });
      return;
    }
    console.error('Save destination error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSavedDestinations = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    
    const destinations = await prisma.savedDestination.findMany({
      where: { userId: req.user.userId },
      include: { city: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(destinations.map(d => d.city));
  } catch (error) {
    console.error('Get saved destinations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeSavedDestination = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    
    const { cityId } = req.params;
    
    await prisma.savedDestination.deleteMany({
      where: { userId: req.user.userId, cityId }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Remove saved destination error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
