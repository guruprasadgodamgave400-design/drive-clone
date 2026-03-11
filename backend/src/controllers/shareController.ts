import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const generateShareLink = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
        const { id } = req.params;

        const file = await prisma.file.findUnique({ where: { id, userId: req.user.id } });
        if (!file) return res.status(404).json({ error: 'File not found' });

        // Since we are using local storage, we just provide the direct link to the static file
        const fileUrl = `${req.protocol}://${req.get('host')}/${file.path}`;

        res.json({ url: fileUrl, expiresIn: 'Unlimited for Local Dev' });
    } catch (error) {
        console.error('Share link error:', error);
        res.status(500).json({ error: 'Failed to generate share link' });
    }
};
