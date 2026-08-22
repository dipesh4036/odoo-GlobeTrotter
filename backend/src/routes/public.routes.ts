import { Router } from 'express';
import { getPublicTripBySlug } from '../controllers/public.controller';

const router = Router();

router.get('/trips/:slug', getPublicTripBySlug);

export default router;
