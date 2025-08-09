import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import useExportPanel from '../../hooks/useExportPanel';
import ExportStatusFilter from './ExportStatusFilter';
import ExportStatsPreview from './ExportStatsPreview';
import ExportFormatButtons from './ExportFormatButtons';

const ExportPanel = () => {
  const { t } = useTranslation();
  const {
    selectedStatus,
    setSelectedStatus,
    isExporting,
    statusOptions,
    exportFormats,
    handleExport,
    stats,
    getSelectedStatusLabel
  } = useExportPanel();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <ArrowDownTrayIcon className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t('dashboard.export.title')}
          </h3>
          <p className="text-sm text-gray-600">
            {t('dashboard.export.subtitle')}
          </p>
        </div>
      </div>

      {/* Status Filter */}
      <ExportStatusFilter
        statusOptions={statusOptions}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Stats Preview */}
      <ExportStatsPreview stats={stats} />

      {/* Export Format Buttons */}
      <ExportFormatButtons
        formats={exportFormats}
        onExport={handleExport}
        isExporting={isExporting}
        totalReservations={stats.totalReservations}
        selectedStatusLabel={getSelectedStatusLabel()}
      />

      {/* Info Note */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-medium">💡 {t('dashboard.export.tip')}:</span>{' '}
          {t('dashboard.export.tipDescription')}
        </p>
      </div>
    </div>
  );
};

export default ExportPanel;