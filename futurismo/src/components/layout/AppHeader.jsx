import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { useLayout } from '../../contexts/LayoutContext';
import { 
  Bars3Icon, 
  BellIcon, 
  MagnifyingGlassIcon, 
  ChevronDownIcon, 
  ArrowRightOnRectangleIcon, 
  UserIcon, 
  CogIcon 
} from '@heroicons/react/24/outline';
import LanguageToggle from '../common/LanguageToggle';

const AppHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { toggleSidebar, viewport } = useLayout();
  const { t } = useTranslation();
  
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileMenuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        {/* Menu button */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
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
        {/* Language toggle */}
        <LanguageToggle />

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
          <BellIcon className="w-5 h-5 text-gray-500" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {viewport.isDesktop && (
              <>
                <span className="text-sm font-medium text-gray-900">
                  {user?.name || 'Usuario'}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              </>
            )}
          </button>

          {/* Dropdown */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  navigate('/profile');
                  setProfileMenuOpen(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
              >
                <UserIcon className="w-4 h-4 mr-3" />
                {t('profile.myProfile')}
              </button>
              <button
                onClick={() => {
                  navigate('/settings');
                  setProfileMenuOpen(false);
                }}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
              >
                <CogIcon className="w-4 h-4 mr-3" />
                {t('profile.configuration')}
              </button>
              <hr className="my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                {t('profile.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppHeader;