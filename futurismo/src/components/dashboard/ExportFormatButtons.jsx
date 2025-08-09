import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const ExportFormatButtons = ({ 
  formats, 
  onExport, 
  isExporting, 
  totalReservations,
  selectedStatusLabel 
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">
        {t('dashboard.export.exportFormat')}
      </h4>
      {formats.map((format) => (
        <button
          key={format.format}
          onClick={() => onExport(format.format)}
          disabled={isExporting || totalReservations === 0}
          className={`w-full flex items-center justify-between p-4 rounded-lg text-white font-medium transition-all ${format.color} ${
            isExporting || totalReservations === 0 
              ? 'opacity-50 cursor-not-allowed' 
              : 'transform hover:scale-105'
          }`}
        >
          <div className="flex items-center gap-3">
            <format.icon className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">
                {t('dashboard.export.exportButton', { 
                  count: totalReservations, 
                  format: format.label 
                })}
              </div>
              <div className="text-sm opacity-90">
                {format.description} • {selectedStatusLabel}
              </div>
            </div>
          </div>
          {isExporting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ArrowDownTrayIcon className="w-5 h-5" />
          )}
        </button>
      ))}
    </div>
  );
};

ExportFormatButtons.propTypes = {
  formats: PropTypes.arrayOf(PropTypes.shape({
    format: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  })).isRequired,
  onExport: PropTypes.func.isRequired,
  isExporting: PropTypes.bool.isRequired,
  totalReservations: PropTypes.number.isRequired,
  selectedStatusLabel: PropTypes.string.isRequired
};

export default ExportFormatButtons;