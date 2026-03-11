import React, { useEffect } from 'react';
import { useFileStore, FileItem } from '../stores/useFileStore';
import { Folder as FolderIcon, File as FileIcon, MoreVertical, Trash2, Edit2, Share2, RefreshCw, Download, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Menu, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import { useDebounce } from 'use-debounce';

interface FileExplorerProps {
    searchQuery: string;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ searchQuery }) => {
    const {
        files,
        folders,
        fetchContents,
        currentFolderId,
        setCurrentFolder,
        currentView,
        isLoading,
        deleteFile,
        renameFile,
        restoreFile,
        getShareLink,
        toggleStar
    } = useFileStore();

    const [debouncedSearch] = useDebounce(searchQuery, 300);

    useEffect(() => {
        fetchContents(currentFolderId);
    }, [currentFolderId, currentView, fetchContents]);

    // Filtering based on search (basic implementation for now)
    const filteredFolders = folders.filter((f) => f.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
    const filteredFiles = files.filter((f) => f.name.toLowerCase().includes(debouncedSearch.toLowerCase()));

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const handleRename = (file: FileItem) => {
        const newName = prompt('Enter new file name:', file.name);
        if (newName && newName !== file.name) {
            renameFile(file.id, newName);
            toast.success('File renamed');
        }
    };

    const handleShare = async (file: FileItem) => {
        try {
            const link = await getShareLink(file.id);
            await navigator.clipboard.writeText(link);
            toast.success('Share link copied to clipboard!');
        } catch {
            toast.error('Failed to generate share link');
        }
    };

    const handleDownload = async (file: FileItem) => {
        try {
            const link = await getShareLink(file.id);
            window.open(link, '_blank');
        } catch {
            toast.error('Failed to download');
        }
    };

    const getViewTitle = () => {
        switch (currentView) {
            case 'trash': return 'Trash';
            case 'recent': return 'Recent Files';
            case 'starred': return 'Starred';
            default: return 'My Drive';
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-900">{getViewTitle()}</h1>
                {/* Breadcrumbs can go here */}
            </div>

            {filteredFolders.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Folders</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredFolders.map((folder) => (
                            <div
                                key={folder.id}
                                onClick={() => setCurrentFolder(folder.id)}
                                className="group flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-300 cursor-pointer transition-all shadow-sm"
                            >
                                <FolderIcon className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 mr-3 flex-shrink-0" fill="currentColor" />
                                <span className="text-sm font-medium text-slate-700 truncate">{folder.name}</span>
                                <button className="ml-auto p-1 text-slate-400 hover:bg-slate-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Files</h2>
                {filteredFiles.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <p className="text-slate-500 text-sm">No files uploaded yet.</p>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider rounded-tl-xl">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Last Modified</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">File Size</th>
                                    <th scope="col" className="relative px-6 py-3 rounded-tr-xl"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {filteredFiles.map((file) => (
                                    <tr key={file.id} className="hover:bg-slate-50 group transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex items-center cursor-pointer" onClick={() => handleDownload(file)}>
                                                    <FileIcon className="flex-shrink-0 h-5 w-5 text-indigo-400" />
                                                    <span className="ml-3 text-sm font-medium text-slate-900 max-w-[200px] truncate">{file.name}</span>
                                                </div>
                                                {file.isStarred && <Star className="ml-2 h-4 w-4 text-yellow-400 fill-current" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                            <span className="text-sm text-slate-500">{format(new Date(file.updatedAt), 'MMM d, yyyy')}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                            <span className="text-sm text-slate-500">{formatSize(file.size)}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Menu as="div" className="relative inline-block text-left">
                                                <Menu.Button className="text-slate-400 hover:text-indigo-600 p-1 rounded-full hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100">
                                                    <MoreVertical className="w-5 h-5" />
                                                </Menu.Button>
                                                <Transition
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-8 top-0 mt-2 w-48 origin-top-right divide-y divide-slate-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                                        <div className="px-1 py-1 ">
                                                            {currentView !== 'trash' && (
                                                                <>
                                                                    <Menu.Item>
                                                                        {({ active }) => (
                                                                            <button onClick={() => handleDownload(file)} className={`${active ? 'bg-indigo-500 text-white' : 'text-slate-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                                                                <Download className="mr-2 h-4 w-4" /> Download
                                                                            </button>
                                                                        )}
                                                                    </Menu.Item>
                                                                    <Menu.Item>
                                                                        {({ active }) => (
                                                                            <button onClick={() => handleRename(file)} className={`${active ? 'bg-indigo-500 text-white' : 'text-slate-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                                                                <Edit2 className="mr-2 h-4 w-4" /> Rename
                                                                            </button>
                                                                        )}
                                                                    </Menu.Item>
                                                                    <Menu.Item>
                                                                        {({ active }) => (
                                                                            <button onClick={() => toggleStar(file.id, !file.isStarred)} className={`${active ? 'bg-indigo-500 text-white' : 'text-slate-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                                                                <Star className={`mr-2 h-4 w-4 ${file.isStarred ? 'fill-current text-yellow-500' : ''}`} /> {file.isStarred ? 'Remove Star' : 'Add Star'}
                                                                            </button>
                                                                        )}
                                                                    </Menu.Item>
                                                                    <Menu.Item>
                                                                        {({ active }) => (
                                                                            <button onClick={() => handleShare(file)} className={`${active ? 'bg-indigo-500 text-white' : 'text-slate-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                                                                <Share2 className="mr-2 h-4 w-4" /> Get Share Link
                                                                            </button>
                                                                        )}
                                                                    </Menu.Item>
                                                                    <Menu.Item>
                                                                        {({ active }) => (
                                                                            <button onClick={() => { deleteFile(file.id); toast.success('Moved to trash'); }} className={`${active ? 'bg-red-500 text-white' : 'text-red-600'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                                                                <Trash2 className="mr-2 h-4 w-4" /> Move to Trash
                                                                            </button>
                                                                        )}
                                                                    </Menu.Item>
                                                                </>
                                                            )}
                                                            {currentView === 'trash' && (
                                                                <>
                                                                    <Menu.Item>
                                                                        {({ active }) => (
                                                                            <button onClick={() => { restoreFile(file.id); toast.success('File restored'); }} className={`${active ? 'bg-indigo-500 text-white' : 'text-indigo-600'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                                                                <RefreshCw className="mr-2 h-4 w-4" /> Restore
                                                                            </button>
                                                                        )}
                                                                    </Menu.Item>
                                                                </>
                                                            )}
                                                        </div>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileExplorer;
