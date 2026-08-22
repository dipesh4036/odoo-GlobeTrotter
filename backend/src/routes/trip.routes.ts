import { Router } from 'express';
import { createTrip, getTrips, getTripById, updateTrip, deleteTrip, cancelTrip, getTripBudget, getTripCalendar } from '../controllers/trip.controller';
import { createStop, reorderStops } from '../controllers/stop.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', requireAuth, createTrip);
router.get('/', requireAuth, getTrips);
router.get('/:id', requireAuth, getTripById);
router.patch('/:id', requireAuth, updateTrip);
router.delete('/:id', requireAuth, deleteTrip);
router.post('/:id/cancel', requireAuth, cancelTrip);

router.post('/:id/stops', requireAuth, createStop);
router.patch('/:id/stops/reorder', requireAuth, reorderStops);

router.get('/:id/budget', requireAuth, getTripBudget);
router.get('/:id/calendar', requireAuth, getTripCalendar);

export default router;
