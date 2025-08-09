import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const ChartControls = ({ 
  timeRange, 
  setTimeRange, 
  chartType, 
  setChartType,
  timeRangeOptions,
  chartTypeOptions 
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold">
        {t('dashboard.chart.title')}
      </h3>
      
      <div className="flex items-center gap-4">
        {/* Time range selector */}
        <select
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          aria-label={t('dashboard.chart.selectTimeRange')}
        >
          {timeRangeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Chart type selector */}
        <div className="flex bg-gray-100 rounded-lg p-1" role="group" aria-label={t('dashboard.chart.selectChartType')}>
          {chartTypeOptions.map(option => (
            <button
              key={option.value}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                chartType === option.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setChartType(option.value)}
              aria-pressed={chartType === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

ChartControls.propTypes = {
  timeRange: PropTypes.string.isRequired,
  setTimeRange: PropTypes.func.isRequired,
  chartType: PropTypes.string.isRequired,
  setChartType: PropTypes.func.isRequired,
  timeRangeOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  chartTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};

export default ChartControls;