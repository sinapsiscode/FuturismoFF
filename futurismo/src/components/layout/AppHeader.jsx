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
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/monitoring?search=${encodeURIComponent(searchQuery)}`);
      setShowMobileSearch(false);
    }
  };

  return (
    <div className="min-h-16 bg-white border-b border-gray-200 shadow-sm">
      {/* Main header row */}
      <div className="h-16 px-3 sm:px-4 lg:px-6 xl:px-8 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
            aria-label={t('common.toggleMenu')}
          >
            <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>

          {/* Mobile search button */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
            aria-label={t('search.toggleSearch')}
          >
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
          </button>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden md:block relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search.searchServices')}
              className="pl-9 lg:pl-10 pr-4 py-2 lg:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base w-48 lg:w-64 xl:w-80 transition-all duration-200"
            />
          </form>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
          <div className="hidden sm:block">
            <LanguageToggle />
          </div>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors relative touch-manipulation">
            <BellIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          <ProfileMenu 
            user={user} 
            viewport={viewport} 
            onLogout={handleLogout} 
          />
        </div>
      </div>

      {/* Mobile search bar - expandable */}
      {showMobileSearch && (
        <div className="md:hidden border-t border-gray-200 px-3 py-3 bg-gray-50">
          <form onSubmit={handleSearch} className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search.searchServices')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              autoFocus
            />
          </form>
          <div className="mt-3 sm:hidden">
            <LanguageToggle />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppHeader;