import { Router } from 'express';
import { updateStop, deleteStop } from '../controllers/stop.controller';
import { createStopActivity } from '../controllers/stopActivity.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.patch('/:id', requireAuth, updateStop);
router.delete('/:id', requireAuth, deleteStop);
router.post('/:id/activities', requireAuth, createStopActivity);

export default router;
