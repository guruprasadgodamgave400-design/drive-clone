import { create } from 'zustand';
import api from '../api/axios';

export interface FileItem {
    id: string;
    name: string;
    size: number;
    type: string;
    folderId: string | null;
    isDeleted: boolean;
    isStarred: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FolderItem {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
}

interface FileStoreState {
    files: FileItem[];
    folders: FolderItem[];
    currentFolderId: string | null;
    currentView: 'drive' | 'trash' | 'recent' | 'starred';
    isLoading: boolean;
    fetchContents: (folderId: string | null) => Promise<void>;
    createFolder: (name: string, parentId: string | null) => Promise<void>;
    deleteFile: (id: string) => Promise<void>;
    renameFile: (id: string, newName: string) => Promise<void>;
    renameFolder: (id: string, newName: string) => Promise<void>;
    deleteFolder: (id: string) => Promise<void>;
    setCurrentFolder: (folderId: string | null) => void;
    setCurrentView: (view: 'drive' | 'trash' | 'recent' | 'starred') => void;
    getShareLink: (id: string) => Promise<string>;
    restoreFile: (id: string) => Promise<void>;
    toggleStar: (id: string, isStarred: boolean) => Promise<void>;
}

export const useFileStore = create<FileStoreState>((set, get) => ({
    files: [],
    folders: [],
    currentFolderId: null,
    currentView: 'drive',
    isLoading: false,

    setCurrentView: (view) => {
        set({ currentView: view, currentFolderId: null });
        get().fetchContents(null);
    },

    setCurrentFolder: (folderId) => {
        set({ currentFolderId: folderId, currentView: 'drive' });
        get().fetchContents(folderId);
    },

    fetchContents: async (folderId) => {
        set({ isLoading: true });
        try {
            const currentView = get().currentView;
            const isTrash = currentView === 'trash';
            const isStarred = currentView === 'starred';
            const isRecent = currentView === 'recent';

            const folderParam = folderId && !isRecent && !isStarred ? `?folderId=${folderId}` : '';
            
            let fileParam = '?';
            if (isTrash) {
                fileParam += 'deleted=true';
            } else {
                fileParam += 'deleted=false';
                if (isStarred) fileParam += '&starred=true';
                if (isRecent) fileParam += '&recent=true';
                if (folderId && !isStarred && !isRecent) fileParam += `&folderId=${folderId}`;
            }

            // Don't fetch folders if we are in trash, just assume flat file structure for now
            const [foldersRes, filesRes] = await Promise.all([
                (isTrash || isStarred || isRecent) ? { data: [] } : api.get(`/folders${folderParam}`),
                api.get(`/files${fileParam}`)
            ]);

            set({ folders: (isTrash || isStarred || isRecent) ? [] : foldersRes.data, files: filesRes.data, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch contents', error);
            set({ isLoading: false });
        }
    },

    createFolder: async (name, parentId) => {
        try {
            await api.post('/folders', { name, parentId });
            get().fetchContents(parentId);
        } catch (error) {
            console.error('Failed to create folder', error);
            throw error;
        }
    },

    deleteFile: async (id) => {
        try {
            await api.delete(`/files/${id}/trash`);
            get().fetchContents(get().currentFolderId);
        } catch (error) {
            console.error(error);
        }
    },

    renameFile: async (id, newName) => {
        try {
            await api.put(`/files/${id}`, { name: newName });
            get().fetchContents(get().currentFolderId);
        } catch (error) {
            console.error(error);
        }
    },

    renameFolder: async (id, newName) => {
        try {
            await api.put(`/folders/${id}`, { name: newName });
            get().fetchContents(get().currentFolderId);
        } catch (error) {
            console.error(error);
        }
    },

    deleteFolder: async (id) => {
        try {
            await api.delete(`/folders/${id}`);
            get().fetchContents(get().currentFolderId);
        } catch (error) {
            console.error(error);
        }
    },

    getShareLink: async (id) => {
        try {
            const res = await api.post(`/share/file/${id}`);
            return res.data.url;
        } catch (error) {
            console.error('Failed to get share link', error);
            throw error;
        }
    },

    restoreFile: async (id) => {
        try {
            await api.post(`/files/${id}/restore`);
            get().fetchContents(get().currentFolderId);
        } catch (error) {
            console.error(error);
        }
    },

    toggleStar: async (id, isStarred) => {
        try {
            await api.put(`/files/${id}/star`, { isStarred });
            get().fetchContents(get().currentFolderId);
        } catch (error) {
            console.error('Failed to toggle star', error);
        }
    }
}));
