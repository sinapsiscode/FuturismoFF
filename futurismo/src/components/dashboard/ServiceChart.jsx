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
    chartTypeOptions,
    loading,
    error
  } = useServiceChart();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
            <div className="h-32 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center text-red-600">
          <p>Error al cargar las estadísticas: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
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
      />

      <ChartSummary summaryData={summaryData} />
    </div>
  );
};

export default ServiceChart;