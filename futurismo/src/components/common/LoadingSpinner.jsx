import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const LoadingSpinner = ({ 
  size = 'md', 
  fullScreen = false, 
  text = null,
  showDefaultText = true 
}) => {
  const { t } = useTranslation();
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const displayText = text || (showDefaultText ? t('common.loading') : null);

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`spinner ${sizeClasses[size]}`}
        role="status"
        aria-label={displayText || t('common.loading')}
      >
        <span className="sr-only">{displayText || t('common.loading')}</span>
      </div>
      {displayText && (
        <p className="mt-4 text-gray-600 text-sm animate-pulse">
          {displayText}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {spinner}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullScreen: PropTypes.bool,
  text: PropTypes.string,
  showDefaultText: PropTypes.bool
};

export default LoadingSpinner;