import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const ChartSummary = ({ summaryData = {} }) => {
  const { t } = useTranslation();

  const summaryItems = [
    {
      label: t('dashboard.chart.summary.popularTour'),
      value: summaryData.popularTour || 'N/A',
      highlight: true
    },
    {
      label: t('dashboard.chart.summary.avgPerBooking'),
      value: `S/${summaryData.avgPerBooking || 0}`
    },
    {
      label: t('dashboard.chart.summary.bestDay'),
      value: summaryData.bestDay || 'N/A'
    }
  ];

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryItems.map((item, index) => (
          <div key={index} className="text-center">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{item.label}</p>
            <p className={`mt-1 text-lg font-bold ${item.highlight ? 'text-blue-600' : 'text-gray-900'}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

ChartSummary.propTypes = {
  summaryData: PropTypes.shape({
    popularTour: PropTypes.string,
    avgPerBooking: PropTypes.number,
    bestDay: PropTypes.string,
    conversionRate: PropTypes.number
  })
};

export default ChartSummary;