import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FunnelIcon } from '@heroicons/react/24/outline';
import exportService from '../../services/exportService';

const ExportStatusFilter = ({ 
  statusOptions, 
  selectedStatus, 
  onStatusChange 
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <FunnelIcon className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {t('dashboard.export.filterByStatus')}
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {statusOptions.map((option) => {
          const optionStats = exportService.getFilteredStats(option.value);
          return (
            <button
              key={option.value}
              onClick={() => onStatusChange(option.value)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedStatus === option.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <option.icon className={`w-5 h-5 ${option.color}`} />
                  <span className="text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-gray-700">
                    {optionStats.totalReservations}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t('dashboard.export.reservations')}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Active filter info */}
      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-medium">📋 {t('dashboard.export.activeFilter')}:</span>{' '}
          {statusOptions.find(opt => opt.value === selectedStatus)?.label}
          {selectedStatus !== 'all' && (
            <span className="ml-2">
              • {t('dashboard.export.filterNote', { status: selectedStatus })}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

ExportStatusFilter.propTypes = {
  statusOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired
  })).isRequired,
  selectedStatus: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired
};

export default ExportStatusFilter;