import React from 'react';
import useServiceChart from '../../hooks/useServiceChart';
import ChartControls from './ChartControls';
import ChartKPIs from './ChartKPIs';
import ChartViews from './ChartViews';
import ChartSummary from './ChartSummary';

const ServiceChart = () => {
  const {
    chartType,
    setChartType,
    timeRange,
    setTimeRange,
    lineData,
    barData,
    pieData,
    kpiData,
    summaryData,
    timeRangeOptions,
    chartTypeOptions
  } = useServiceChart();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <ChartControls
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        chartType={chartType}
        setChartType={setChartType}
        timeRangeOptions={timeRangeOptions}
        chartTypeOptions={chartTypeOptions}
      />

      <ChartKPIs kpiData={kpiData} />

      <ChartViews
        chartType={chartType}
        lineData={lineData}
        barData={barData}
        pieData={pieData}
      />

      <ChartSummary summaryData={summaryData} />
    </div>
  );
};

export default ServiceChart;