import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { useLayout } from '../../contexts/LayoutContext';
import AppSidebarEnhanced from './AppSidebarEnhanced';
import AppHeader from './AppHeader';

const AppLayout = () => {
  const { sidebarOpen, closeSidebar, viewport } = useLayout();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Overlay */}
      {viewport.isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-64 sm:w-72 lg:w-80
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-30
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Main navigation"
      >
        <AppSidebarEnhanced />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm">
          <AppHeader />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto overflow-x-hidden">
            <div className="min-h-full">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;