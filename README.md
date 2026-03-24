# Drive Clone

A full-stack file management application (Google Drive Clone) built with modern web technologies. It provides features like authentication, file and folder management, uploading and sharing files, and trash functionality.

## Tech Stack

### Frontend
- **Framework:** React with Vite
- **Styling:** Tailwind CSS & Headless UI
- **State Management:** Zustand
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **File Uploads:** React Dropzone

### Backend
- **Framework:** Node.js with Express
- **Database ORM:** Prisma
- **Database:** SQLite (local development)
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt
- **File Handling:** Multer
- **Security:** Helmet & CORS

## Project Structure

- `/frontend` - Contains the React user interface
- `/backend` - Contains the Express server and API logic
- `/roadmap-ui` - Additional UI workspace

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Execution

#### 1. Backend Setup
```bash
cd backend
npm install
# Set up your .env file with JWT_SECRET and DATABASE_URL (if not SQLite)
npx prisma generate
npx prisma db push
npm run dev
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Features
- **User Authentication:** Secure login and registration flows.
- **File Management:** Upload, organize into folders, delete, and manage files.
- **Sharing:** Secure link generation to share files across systems.
- **Responsive UI:** A modern dashboard built with Tailwind CSS.

## License
ISC
