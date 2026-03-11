import { Router } from 'express';
import { generateShareLink } from '../controllers/shareController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/file/:id', generateShareLink as any);

export default router;
