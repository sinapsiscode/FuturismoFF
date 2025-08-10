import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { useLayout } from '../../contexts/LayoutContext';
import { 
  Bars3Icon, 
  BellIcon, 
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import LanguageToggle from '../common/LanguageToggle';
import ProfileMenu from './ProfileMenu';

const AppHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { toggleSidebar, viewport } = useLayout();
  const { t } = useTranslation();
  
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/monitoring?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label={t('common.toggleMenu')}
        >
          <Bars3Icon className="w-5 h-5 text-gray-500" />
        </button>

        {/* Search - hidden on mobile */}
        {viewport.isDesktop && (
          <form onSubmit={handleSearch} className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search.searchServices')}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary w-80"
            />
          </form>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-4">
        <LanguageToggle />

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
          <BellIcon className="w-5 h-5 text-gray-500" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <ProfileMenu 
          user={user} 
          viewport={viewport} 
          onLogout={handleLogout} 
        />
      </div>
    </div>
  );
};

export default AppHeader;