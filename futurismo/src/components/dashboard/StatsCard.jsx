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
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-40 mt-2"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          
          {trend && (
            <div className="flex items-center mt-2">
              {isPositiveTrend ? (
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                isPositiveTrend ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                {translationText}
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
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