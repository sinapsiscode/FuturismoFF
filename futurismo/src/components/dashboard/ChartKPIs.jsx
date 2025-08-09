import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { formatters } from '../../utils/formatters';

const ChartKPIs = ({ kpiData }) => {
  const { t } = useTranslation();

  const kpiConfigs = [
    {
      key: 'totalReservas',
      label: t('dashboard.chart.kpis.totalReservations'),
      bgClass: 'bg-primary-50',
      textClass: 'text-primary',
      showCurrency: false
    },
    {
      key: 'totalTuristas',
      label: t('dashboard.chart.kpis.totalTourists'),
      bgClass: 'bg-secondary-50',
      textClass: 'text-secondary',
      showCurrency: false
    },
    {
      key: 'ingresosTotales',
      label: t('dashboard.chart.kpis.totalRevenue'),
      bgClass: 'bg-success-50',
      textClass: 'text-success',
      showCurrency: true
    },
    {
      key: 'tasaOcupacion',
      label: t('dashboard.chart.kpis.occupancyRate'),
      bgClass: 'bg-purple-50',
      textClass: 'text-purple',
      showCurrency: false,
      isPercentage: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpiConfigs.map((config) => {
        const data = kpiData[config.key];
        const isPositive = data.crecimiento >= 0;
        
        return (
          <div key={config.key} className={`${config.bgClass} rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm font-medium ${config.textClass}-900`}>
                {config.label}
              </p>
              <div className={`flex items-center text-xs font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositive ? (
                  <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
                )}
                {Math.abs(data.crecimiento)}%
              </div>
            </div>
            <p className={`text-2xl font-bold ${config.textClass}-800`}>
              {config.showCurrency && '$'}
              {config.showCurrency ? formatters.formatCurrency(data.actual) : data.actual}
              {config.isPercentage && '%'}
            </p>
            <p className={`text-xs ${config.textClass}-700 mt-1`}>
              {t('dashboard.chart.kpis.vs')} 
              {config.showCurrency && ' $'}
              {config.showCurrency ? formatters.formatCurrency(data.anterior) : data.anterior}
              {config.isPercentage && '%'} 
              {' '}{t('dashboard.chart.kpis.previousMonth')}
            </p>
          </div>
        );
      })}
    </div>
  );
};

ChartKPIs.propTypes = {
  kpiData: PropTypes.shape({
    totalReservas: PropTypes.shape({
      actual: PropTypes.number.isRequired,
      anterior: PropTypes.number.isRequired,
      crecimiento: PropTypes.number.isRequired
    }).isRequired,
    totalTuristas: PropTypes.shape({
      actual: PropTypes.number.isRequired,
      anterior: PropTypes.number.isRequired,
      crecimiento: PropTypes.number.isRequired
    }).isRequired,
    ingresosTotales: PropTypes.shape({
      actual: PropTypes.number.isRequired,
      anterior: PropTypes.number.isRequired,
      crecimiento: PropTypes.number.isRequired
    }).isRequired,
    tasaOcupacion: PropTypes.shape({
      actual: PropTypes.number.isRequired,
      anterior: PropTypes.number.isRequired,
      crecimiento: PropTypes.number.isRequired
    }).isRequired
  }).isRequired
};

export default ChartKPIs;