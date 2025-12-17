import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#0B0E1A] overflow-hidden">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Navbar */}
                <Navbar onMenuClick={() => setSidebarOpen(true)} />

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 bg-gradient-mesh">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
