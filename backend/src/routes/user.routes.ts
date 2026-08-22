import { Router } from 'express';
import { updateProfile, saveDestination, getSavedDestinations, removeSavedDestination } from '../controllers/user.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.patch('/me', requireAuth, updateProfile);
router.post('/me/saved-destinations', requireAuth, saveDestination);
router.get('/me/saved-destinations', requireAuth, getSavedDestinations);
router.delete('/me/saved-destinations/:cityId', requireAuth, removeSavedDestination);

export default router;
