import { Router } from 'express';
import { uploadFile, getFiles, renameFile, softDeleteFile, restoreFile, searchFiles } from '../controllers/fileController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Endpoint for uploading a single file
router.post('/upload', authenticateToken, upload.single('file'), uploadFile as any);

// Search endpoint
router.get('/search', authenticateToken, searchFiles as any);

// Other CRUD endpoints
router.get('/', authenticateToken, getFiles as any);
router.put('/:id', authenticateToken, renameFile as any);
router.delete('/:id/trash', authenticateToken, softDeleteFile as any);
router.post('/:id/restore', authenticateToken, restoreFile as any);

export default router;
