import { Router } from 'express';
import { createFolder, getFolders, renameFolder, deleteFolder } from '../controllers/folderController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/', createFolder as any);
router.get('/', getFolders as any);
router.put('/:id', renameFolder as any);
router.delete('/:id', deleteFolder as any);

export default router;
