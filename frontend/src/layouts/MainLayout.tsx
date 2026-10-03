import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

export const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen cyber-bg text-slate-100 flex flex-col">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
      <div className="flex-1 flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
          <footer className="py-4 px-6 border-t border-slate-800/60 text-center text-xs text-slate-500 font-mono">
            AI-Powered Smart Car Access and Keyless Assistance System — Academic Software Simulation
          </footer>
        </main>
      </div>
    </div>
  );
};
