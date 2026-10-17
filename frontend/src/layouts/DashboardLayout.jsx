import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Header } from '../components/common/Header';
import { ToastContainer } from '../components/common/ToastContainer';

export const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex font-sans antialiased text-charcoal">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        closeMobileSidebar={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header toggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        {/* Page Container */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Toast Feedback */}
      <ToastContainer />
    </div>
  );
};
