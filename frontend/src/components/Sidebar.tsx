import { useState } from 'react';
import { HardDrive, Clock, Star, Trash2, Plus } from 'lucide-react';
import UploadModal from './UploadModal';
import { useFileStore } from '../stores/useFileStore';

const Sidebar = () => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const { currentView, setCurrentView } = useFileStore();

    return (
        <div className="w-64 flex-shrink-0 flex flex-col pt-5 pb-4 bg-slate-50 border-r border-slate-200 h-full overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-6">
                <HardDrive className="h-8 w-8 text-indigo-600" />
                <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight">Drive Clone</span>
            </div>

            <div className="px-4 mb-6 space-y-2">
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    New File
                </button>
            </div>

            <nav className="mt-2 flex-1 px-3 space-y-1">
                <button
                    onClick={() => setCurrentView('drive')}
                    className={`w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentView === 'drive' ? 'text-slate-900 bg-slate-200/50' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    <HardDrive className={`mr-3 flex-shrink-0 h-5 w-5 ${currentView === 'drive' ? 'text-slate-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    My Drive
                </button>
                <button
                    onClick={() => setCurrentView('recent')}
                    className={`w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentView === 'recent' ? 'text-slate-900 bg-slate-200/50' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    <Clock className={`mr-3 flex-shrink-0 h-5 w-5 ${currentView === 'recent' ? 'text-slate-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    Recent
                </button>
                <button
                    onClick={() => setCurrentView('starred')}
                    className={`w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentView === 'starred' ? 'text-slate-900 bg-slate-200/50' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    <Star className={`mr-3 flex-shrink-0 h-5 w-5 ${currentView === 'starred' ? 'text-slate-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    Starred
                </button>
                <button
                    onClick={() => setCurrentView('trash')}
                    className={`w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${currentView === 'trash' ? 'text-slate-900 bg-slate-200/50' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                    <Trash2 className={`mr-3 flex-shrink-0 h-5 w-5 ${currentView === 'trash' ? 'text-slate-500' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    Trash
                </button>
            </nav>

            <div className="flex-shrink-0 px-4 mt-auto mb-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Storage</p>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2 overflow-hidden">
                        <div className="bg-indigo-600 h-1.5 rounded-full w-1/4"></div>
                    </div>
                    <p className="text-xs text-slate-600">
                        <span className="font-semibold text-slate-900">2.5 GB</span> of 10 GB used
                    </p>
                </div>
            </div>

            <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
        </div>
    );
};

export default Sidebar;
