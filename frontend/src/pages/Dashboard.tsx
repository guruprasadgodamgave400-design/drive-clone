import { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import Sidebar from '../components/Sidebar';
import FileExplorer from '../components/FileExplorer';

const Dashboard = () => {
    const { user, logout } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-white">
                    <div className="flex-1 max-w-2xl px-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search in Drive..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-full leading-5 bg-slate-50 placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                {user?.name?.[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="text-sm text-slate-500 hover:text-slate-700 font-medium"
                        >
                            Sign out
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6 bg-white">
                    <FileExplorer searchQuery={searchQuery} />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
