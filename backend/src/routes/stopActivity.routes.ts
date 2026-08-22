import { Router } from 'express';
import { deleteStopActivity, reorderStopActivities } from '../controllers/stopActivity.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.patch('/reorder', requireAuth, reorderStopActivities);
router.delete('/:id', requireAuth, deleteStopActivity);

export default router;
