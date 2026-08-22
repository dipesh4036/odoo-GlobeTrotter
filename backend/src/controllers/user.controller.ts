import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { updateProfileSchema } from '../schemas/user.schema';

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
