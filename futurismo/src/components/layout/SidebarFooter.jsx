import React from 'react';
import { useTranslation } from 'react-i18next';
import { APP_NAME, APP_YEAR } from '../../constants/layoutConstants';

const SidebarFooter = () => {
  const { t } = useTranslation();

  return (
    <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="text-center">
        <p className="text-xs sm:text-xs text-gray-500 leading-relaxed">
          {t('common.copyright', { year: APP_YEAR, appName: APP_NAME })}
        </p>
      </div>
    </div>
  );
};

export default SidebarFooter;