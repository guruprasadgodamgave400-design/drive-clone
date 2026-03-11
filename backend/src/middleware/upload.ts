import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Set up local storage
const uploadDir = path.join(process.cwd(), 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // You could create user-specific folders here if req.user exists before this middleware runs.
        // For simplicity, we just put everything in the uploads folder.
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB limit
    },
});
