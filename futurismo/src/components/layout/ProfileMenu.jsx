import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ChevronDownIcon, 
  ArrowRightOnRectangleIcon, 
  UserIcon
} from '@heroicons/react/24/outline';

const ProfileMenu = ({ user, viewport, onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  const getUserInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || 'U';
  };

  const getUserName = () => {
    return user?.name || t('common.user');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {getUserInitial()}
          </span>
        </div>
        {viewport.isDesktop && (
          <>
            <span className="text-sm font-medium text-gray-900">
              {getUserName()}
            </span>
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <button
            onClick={() => {
              navigate('/profile');
              setIsOpen(false);
            }}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
          >
            <UserIcon className="w-4 h-4 mr-3" />
            {t('profile.myProfile')}
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
  );
};

ProfileMenu.propTypes = {
  user: PropTypes.object,
  viewport: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default ProfileMenu;