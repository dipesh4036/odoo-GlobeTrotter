import { Router } from 'express';
import { createTrip, getTrips, getTripById } from '../controllers/trip.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', requireAuth, createTrip);
router.get('/', requireAuth, getTrips);
router.get('/:id', requireAuth, getTripById);

export default router;
