import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, File as FileIcon } from 'lucide-react';
import api from '../api/axios';
import { useFileStore } from '../stores/useFileStore';
import toast from 'react-hot-toast';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const { currentFolderId, fetchContents } = useFileStore();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        const file = acceptedFiles[0]; // For simplicity, handle single file upload first

        const formData = new FormData();
        formData.append('file', file);
        if (currentFolderId) {
            formData.append('folderId', currentFolderId);
        }

        setUploading(true);
        setProgress(0);

        try {
            await api.post('/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
                    setProgress(percentCompleted);
                },
            });

            toast.success('File uploaded successfully!');
            fetchContents(currentFolderId);
            onClose();
        } catch (error) {
            console.error('Upload failed', error);
            toast.error('File upload failed.');
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }, [currentFolderId, fetchContents, onClose]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">Upload File</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors" disabled={uploading}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                            } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        <input {...getInputProps()} />
                        <div className="flex justify-center mb-4">
                            <UploadCloud className={`w-12 h-12 ${isDragActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                        </div>
                        {isDragActive ? (
                            <p className="text-indigo-600 font-medium">Drop the file here ...</p>
                        ) : (
                            <div>
                                <p className="text-slate-700 font-medium mb-1">Drag and drop file here</p>
                                <p className="text-sm text-slate-500">or click to select file</p>
                            </div>
                        )}
                    </div>

                    {uploading && (
                        <div className="mt-6">
                            <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                                <span>Uploading...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
