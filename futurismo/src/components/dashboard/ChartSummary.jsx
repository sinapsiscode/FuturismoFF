import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const ChartSummary = ({ summaryData }) => {
  const { t } = useTranslation();

  const summaryItems = [
    {
      label: t('dashboard.chart.summary.popularTour'),
      value: summaryData.popularTour
    },
    {
      label: t('dashboard.chart.summary.avgPerBooking'),
      value: `$${summaryData.avgPerBooking}`
    },
    {
      label: t('dashboard.chart.summary.bestDay'),
      value: summaryData.bestDay
    },
    {
      label: t('dashboard.chart.summary.conversionRate'),
      value: `${summaryData.conversionRate}%`
    }
  ];

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {summaryItems.map((item, index) => (
          <div key={index}>
            <p className="text-sm text-gray-600">{item.label}</p>
            <p className="font-semibold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

ChartSummary.propTypes = {
  summaryData: PropTypes.shape({
    popularTour: PropTypes.string.isRequired,
    avgPerBooking: PropTypes.number.isRequired,
    bestDay: PropTypes.string.isRequired,
    conversionRate: PropTypes.number.isRequired
  }).isRequired
};

export default ChartSummary;