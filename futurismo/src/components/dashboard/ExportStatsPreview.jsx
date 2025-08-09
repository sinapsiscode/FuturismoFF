import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const ExportStatsPreview = ({ stats }) => {
  const { t } = useTranslation();

  const statItems = [
    {
      value: stats.totalReservations,
      label: t('dashboard.export.stats.reservations'),
      color: 'text-primary-600'
    },
    {
      value: stats.totalTourists,
      label: t('dashboard.export.stats.tourists'),
      color: 'text-green-600'
    },
    {
      value: `$${stats.totalRevenue.toLocaleString()}`,
      label: t('dashboard.export.stats.revenue'),
      color: 'text-purple-600'
    },
    {
      value: `$${Math.round(stats.avgTicket).toLocaleString()}`,
      label: t('dashboard.export.stats.avgTicket'),
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        {t('dashboard.export.dataPreview')}
      </h4>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className={`text-lg font-bold ${item.color}`}>
              {item.value}
            </div>
            <div className="text-xs text-gray-600">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ExportStatsPreview.propTypes = {
  stats: PropTypes.shape({
    totalReservations: PropTypes.number.isRequired,
    totalTourists: PropTypes.number.isRequired,
    totalRevenue: PropTypes.number.isRequired,
    avgTicket: PropTypes.number.isRequired
  }).isRequired
};

export default ExportStatsPreview;