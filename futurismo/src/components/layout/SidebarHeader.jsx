import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { APP_NAME } from '../../constants/layoutConstants';

const SidebarHeader = ({ isMobile, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <GlobeAltIcon className="w-8 h-8 text-primary-600" />
          <h1 className="ml-3 text-xl font-bold text-gray-900">{APP_NAME}</h1>
        </div>
        
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={t('common.closeMenu')}
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
};

SidebarHeader.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default SidebarHeader;