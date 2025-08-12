import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { useLayout } from '../../contexts/LayoutContext';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import RewardsFloatingButton from '../common/RewardsFloatingButton';
import styles from '../../styles/layout.module.css';

const AppLayout = () => {
  const { sidebarOpen, closeSidebar, viewport } = useLayout();

  return (
    <div className={styles.layoutRoot}>
      {/* Mobile Overlay */}
      {viewport.isMobile && (
        <div 
          className={`${styles.mobileOverlay} ${sidebarOpen ? styles.visible : ''}`}
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`${styles.sidebarContainer} ${sidebarOpen ? styles.open : ''}`}
        aria-label="Main navigation"
      >
        <AppSidebar />
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <AppHeader />
        </header>

        {/* Page Content */}
        <main className={styles.contentContainer}>
          <div className={styles.pageContent}>
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Floating Rewards Button */}
      <RewardsFloatingButton />
    </div>
  );
};

export default AppLayout;