import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { createPostSchema } from '../schemas/community.schema';

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, sort } = req.query;
    
    const where: any = {};
    if (search && typeof search === 'string') {
      where.content = { contains: search, mode: 'insensitive' };
    }

    const orderBy: any = {};
    // As per prompt, popular can just mean most recent for now
    if (sort === 'popular') {
      orderBy.createdAt = 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const posts = await prisma.communityPost.findMany({
      where,
      orderBy,
      include: {
        user: { select: { firstName: true, lastName: true, photoUrl: true } },
        trip: { select: { name: true } }
      },
      take: 50
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error('getPosts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
      return;
    }

    const data = parsed.data;

    if (data.tripId) {
       const trip = await prisma.trip.findUnique({ where: { id: data.tripId }});
       if (!trip || trip.userId !== req.user.userId) {
          res.status(403).json({ error: 'Forbidden: You do not own this trip' });
          return;
       }
    }

    const newPost = await prisma.communityPost.create({
      data: {
        userId: req.user.userId,
        content: data.content,
        imageUrl: data.imageUrl,
        tripId: data.tripId
      },
      include: {
        user: { select: { firstName: true, lastName: true, photoUrl: true } },
        trip: { select: { name: true } }
      }
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error('createPost error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
