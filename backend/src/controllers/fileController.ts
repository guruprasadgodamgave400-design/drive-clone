import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const uploadFile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        if (!req.file) return res.status(400).json({ error: 'No file provided' });

        const file = req.file;
        const userId = req.user.id;
        const folderId = req.body.folderId || null;

        // The file is already saved to disk by multer in the 'uploads' directory.
        // We actually just save the relative path to the database.
        const filePath = `uploads/${file.filename}`;

        const newFile = await prisma.file.create({
            data: {
                name: file.originalname,
                size: file.size,
                type: file.mimetype,
                path: filePath,
                userId: userId,
                folderId: folderId,
            },
        });

        res.status(201).json({ message: 'File uploaded successfully', file: newFile });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Internal server error during upload' });
    }
};

export const getFiles = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        const folderId = req.query.folderId as string || null;
        const isDeleted = req.query.deleted === 'true';
        const isStarred = req.query.starred === 'true';
        const isRecent = req.query.recent === 'true';

        let whereClause: any = {
            userId: req.user.id,
            isDeleted: isDeleted,
        };

        if (isStarred) {
            whereClause.isStarred = true;
        } else if (isRecent) {
            // Recent ignores folder tree and just gets newest files
        } else {
            whereClause.folderId = folderId;
        }

        const files = await prisma.file.findMany({
            where: whereClause,
            orderBy: isRecent ? { updatedAt: 'desc' } : undefined,
            take: isRecent ? 20 : undefined,
        });

        res.json(files);
    } catch (error) {
        console.error('Get files error:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
};

export const renameFile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        const { id } = req.params;
        const { name } = req.body;

        if (!name) return res.status(400).json({ error: 'New name is required' });

        const updated = await prisma.file.updateMany({
            where: { id, userId: req.user.id },
            data: { name },
        });

        if (updated.count === 0) return res.status(404).json({ error: 'File not found' });
        res.json({ message: 'File renamed successfully' });
    } catch (error) {
        console.error('Rename file error:', error);
        res.status(500).json({ error: 'Failed to rename file' });
    }
};

export const toggleTrashStatus = async (req: AuthRequest, res: Response, isDeleted: boolean) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        const { id } = req.params;

        const updated = await prisma.file.updateMany({
            where: { id, userId: req.user.id },
            data: { isDeleted },
        });

        if (updated.count === 0) return res.status(404).json({ error: 'File not found' });
        res.json({ message: `File ${isDeleted ? 'moved to trash' : 'restored'} successfully` });
    } catch (error) {
        console.error('Trash status error:', error);
        res.status(500).json({ error: 'Failed to update file status' });
    }
};

export const softDeleteFile = (req: AuthRequest, res: Response) => toggleTrashStatus(req, res, true);
export const restoreFile = (req: AuthRequest, res: Response) => toggleTrashStatus(req, res, false);

export const toggleStarStatus = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        const { id } = req.params;
        const { isStarred } = req.body;

        const updated = await prisma.file.updateMany({
            where: { id, userId: req.user.id },
            data: { isStarred },
        });

        if (updated.count === 0) return res.status(404).json({ error: 'File not found' });
        res.json({ message: 'File star status updated' });
    } catch (error) {
        console.error('Star status error:', error);
        res.status(500).json({ error: 'Failed to update star status' });
    }
};

export const searchFiles = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        const query = req.query.q as string;

        if (!query) return res.json([]);

        const files = await prisma.file.findMany({
            where: {
                userId: req.user.id,
                isDeleted: false,
                name: {
                    contains: query,
                },
            },
        });

        res.json(files);
    } catch (error) {
        console.error('Search files error:', error);
        res.status(500).json({ error: 'Failed to search files' });
    }
};
