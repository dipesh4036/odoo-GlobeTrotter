import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getPublicTripBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const trip = await prisma.trip.findUnique({
      where: { publicSlug: slug },
      include: {
        user: {
          select: { firstName: true, lastName: true, photoUrl: true }
        },
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

    if (!trip || !trip.isPublic) {
      res.status(404).json({ error: 'Trip not found or is not public' });
      return;
    }

    const { userId, ...safeTrip } = trip;

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const rawPublicUrl = `${frontendUrl}/trip/${slug}`;
    
    const text = encodeURIComponent(`Check out my trip itinerary: ${trip.name}`);
    const encodedUrl = encodeURIComponent(rawPublicUrl);

    const shareUrls = {
      raw: rawPublicUrl,
      whatsapp: `https://api.whatsapp.com/send?text=${text}%20${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}`
    };

    res.status(200).json({ trip: safeTrip, shareUrls });
  } catch (error) {
    console.error('Get public trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
