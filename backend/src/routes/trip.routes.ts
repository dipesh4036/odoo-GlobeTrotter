import { Router } from 'express';
import { createTrip, getTrips, getTripById, updateTrip, deleteTrip, cancelTrip } from '../controllers/trip.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', requireAuth, createTrip);
router.get('/', requireAuth, getTrips);
router.get('/:id', requireAuth, getTripById);
router.patch('/:id', requireAuth, updateTrip);
router.delete('/:id', requireAuth, deleteTrip);
router.post('/:id/cancel', requireAuth, cancelTrip);

export default router;
