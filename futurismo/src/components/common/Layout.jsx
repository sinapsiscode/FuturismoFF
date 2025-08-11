import React from 'react';
import { Outlet } from 'react-router-dom';
import useLayout from '../../hooks/useLayout';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileOverlay from './MobileOverlay';
import NotificationCenter from '../notifications/NotificationCenter';

const Layout = () => {
  const {
    sidebarOpen,
    toggleSidebar,
    closeSidebar,
    showMobileOverlay,
    isDesktop,
    mainContentClassName
  } = useLayout();

  return (
    <div className="flex h-screen bg-gray-50">
      <MobileOverlay 
        isVisible={showMobileOverlay}
        onClick={closeSidebar}
      />

      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar}
        isMobile={!isDesktop}
      />

      <div className={mainContentClassName}>
        <Header 
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>

      <NotificationCenter />
    </div>
  );
};

export default Layout;