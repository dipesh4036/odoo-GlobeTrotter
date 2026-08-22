import { Router } from 'express';
import { createTrip, getTrips } from '../controllers/trip.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', requireAuth, createTrip);
router.get('/', requireAuth, getTrips);

export default router;
