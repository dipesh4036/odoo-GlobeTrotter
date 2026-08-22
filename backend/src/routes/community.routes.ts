import { Router } from 'express';
import { getPosts, createPost } from '../controllers/community.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getPosts);
router.post('/', requireAuth, createPost);

export default router;
