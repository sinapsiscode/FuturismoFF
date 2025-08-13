import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'primary',
  subtitle = null,
  loading = false 
}) => {
  const { t, i18n } = useTranslation();
  const [translationText, setTranslationText] = useState('vs mes anterior');
  
  useEffect(() => {
    const checkTranslation = () => {
      const translated = t('dashboard.stats.vsPreviousMonth');
      console.log('Traducción obtenida:', translated);
      console.log('Recursos disponibles:', i18n.hasResourceBundle('es', 'translation'));
      console.log('Idioma actual:', i18n.language);
      
      if (translated !== 'dashboard.stats.vsPreviousMonth') {
        setTranslationText(translated);
      }
    };
    
    checkTranslation();
    
    // Escuchar cambios en las traducciones
    i18n.on('loaded', checkTranslation);
    i18n.on('languageChanged', checkTranslation);
    
    return () => {
      i18n.off('loaded', checkTranslation);
      i18n.off('languageChanged', checkTranslation);
    };
  }, [t, i18n]);
  
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    success: 'bg-success-100 text-success-600',
    danger: 'bg-red-100 text-red-600'
  };

  const isPositiveTrend = trend && trend.startsWith('+');

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 animate-pulse sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="h-3 bg-gray-200 rounded w-20 mb-2 sm:h-4 sm:w-24"></div>
            <div className="h-6 bg-gray-200 rounded w-24 sm:h-8 sm:w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-32 mt-2 sm:h-4 sm:w-40"></div>
          </div>
          <div className="h-10 w-10 bg-gray-200 rounded-lg flex-shrink-0 sm:h-12 sm:w-12"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-600 sm:text-sm truncate">{title}</p>
          <p className="text-xl font-bold text-gray-900 mt-1 sm:text-2xl sm:mt-2 truncate">{value}</p>
          
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>
          )}
          
          {trend && (
            <div className="flex items-center mt-1 sm:mt-2 min-w-0">
              {isPositiveTrend ? (
                <ArrowTrendingUpIcon className="w-3 h-3 text-green-500 mr-1 flex-shrink-0 sm:w-4 sm:h-4" />
              ) : (
                <ArrowTrendingDownIcon className="w-3 h-3 text-red-500 mr-1 flex-shrink-0 sm:w-4 sm:h-4" />
              )}
              <span className={`text-xs font-medium flex-shrink-0 sm:text-sm ${
                isPositiveTrend ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend}
              </span>
              <span className="text-xs text-gray-500 ml-1 truncate sm:text-sm">
                {translationText}
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-2 rounded-lg flex-shrink-0 sm:p-3 ${colorClasses[color]}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  trend: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger']),
  subtitle: PropTypes.string,
  loading: PropTypes.bool
};

export default StatsCard;