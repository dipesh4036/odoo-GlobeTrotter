import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';
import { getUsers, getPopularCities, getPopularActivities, getTrends } from '../controllers/admin.controller';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/users', getUsers);
router.get('/cities/popular', getPopularCities);
router.get('/activities/popular', getPopularActivities);
router.get('/trends', getTrends);

export default router;
