import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const createFolder = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        const { name, parentId } = req.body;

        if (!name) return res.status(400).json({ error: 'Folder name is required' });

        const folder = await prisma.folder.create({
            data: {
                name,
                parentId: parentId || null,
                userId: req.user.id,
            },
        });

        res.status(201).json(folder);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Folder with this name already exists in this location' });
        }
        console.error('Create folder error:', error);
        res.status(500).json({ error: 'Failed to create folder' });
    }
};

export const getFolders = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        const parentId = req.query.parentId as string || null;

        const folders = await prisma.folder.findMany({
            where: {
                userId: req.user.id,
                parentId: parentId,
            },
        });

        res.json(folders);
    } catch (error) {
        console.error('Get folders error:', error);
        res.status(500).json({ error: 'Failed to fetch folders' });
    }
};

export const renameFolder = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        const { id } = req.params;
        const { name } = req.body;

        if (!name) return res.status(400).json({ error: 'New folder name is required' });

        const folder = await prisma.folder.updateMany({
            where: { id, userId: req.user.id },
            data: { name }
        });

        if (folder.count === 0) return res.status(404).json({ error: 'Folder not found' });

        res.json({ message: 'Folder renamed successfully' });
    } catch (error) {
        console.error('Rename folder error:', error);
        res.status(500).json({ error: 'Failed to rename folder' });
    }
};

export const deleteFolder = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        const { id } = req.params;

        // Note: In a real app we might want to soft delete or cascade delete.
        // For simplicity, we assume Prisma handles cascading or we restrict deletion if not empty.
        const folder = await prisma.folder.deleteMany({
            where: { id, userId: req.user.id }
        });

        if (folder.count === 0) return res.status(404).json({ error: 'Folder not found' });

        res.json({ message: 'Folder deleted successfully' });
    } catch (error) {
        console.error('Delete folder error:', error);
        res.status(500).json({ error: 'Failed to delete folder. It might not be empty.' });
    }
};
