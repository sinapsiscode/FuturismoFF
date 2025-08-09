import { useState } from 'react';
import { DocumentTextIcon, DocumentIcon } from '@heroicons/react/24/outline';

const useExportModal = (reservationCount = 0, filterStatus = 'all') => {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    {
      id: 'excel',
      name: 'Excel',
      extension: '.xlsx',
      icon: DocumentTextIcon,
      color: 'from-green-500 to-green-600',
      descriptionKey: 'common.export.formats.excel.description',
      features: [
        'common.export.formats.excel.features.organized',
        'common.export.formats.excel.features.formulas',
        'common.export.formats.excel.features.charts'
      ],
      recommended: reservationCount > 20
    },
    {
      id: 'pdf',
      name: 'PDF',
      extension: '.pdf',
      icon: DocumentTextIcon,
      color: 'from-red-500 to-red-600',
      descriptionKey: 'common.export.formats.pdf.description',
      features: [
        'common.export.formats.pdf.features.professional',
        'common.export.formats.pdf.features.statistics',
        'common.export.formats.pdf.features.printReady'
      ],
      recommended: filterStatus !== 'all'
    },
    {
      id: 'csv',
      name: 'CSV',
      extension: '.csv',
      icon: DocumentIcon,
      color: 'from-blue-500 to-blue-600',
      descriptionKey: 'common.export.formats.csv.description',
      features: [
        'common.export.formats.csv.features.compatibility',
        'common.export.formats.csv.features.import',
        'common.export.formats.csv.features.lightweight'
      ],
      recommended: false
    }
  ];

  const getStatusLabel = () => {
    switch (filterStatus) {
      case 'all': return 'common.export.status.all';
      case 'pendiente': return 'common.export.status.pending';
      case 'confirmada': return 'common.export.status.confirmed';
      case 'cancelada': return 'common.export.status.cancelled';
      case 'completada': return 'common.export.status.completed';
      default: return 'common.export.status.filtered';
    }
  };

  const handleExport = async (onExport, onClose) => {
    if (!selectedFormat) return;
    
    setIsExporting(true);
    try {
      await onExport(selectedFormat);
      setTimeout(() => {
        setIsExporting(false);
        onClose();
        setSelectedFormat(null);
      }, 1000);
    } catch (error) {
      setIsExporting(false);
      console.error('Export error:', error);
    }
  };

  const resetSelection = () => {
    setSelectedFormat(null);
  };

  return {
    selectedFormat,
    setSelectedFormat,
    isExporting,
    formatOptions,
    getStatusLabel,
    handleExport,
    resetSelection
  };
};

export default useExportModal;