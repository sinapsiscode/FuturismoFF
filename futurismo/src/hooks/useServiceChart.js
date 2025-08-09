import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const useServiceChart = () => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('month');
  const { t } = useTranslation();

  // Mock data for charts
  const lineData = [
    { name: t('dashboard.chart.months.jan'), reservas: 65, turistas: 780, ingresos: 27300 },
    { name: t('dashboard.chart.months.feb'), reservas: 78, turistas: 936, ingresos: 32760 },
    { name: t('dashboard.chart.months.mar'), reservas: 92, turistas: 1104, ingresos: 38640 },
    { name: t('dashboard.chart.months.apr'), reservas: 81, turistas: 972, ingresos: 34020 },
    { name: t('dashboard.chart.months.may'), reservas: 98, turistas: 1176, ingresos: 41160 },
    { name: t('dashboard.chart.months.jun'), reservas: 105, turistas: 1260, ingresos: 44100 },
    { name: t('dashboard.chart.months.jul'), reservas: 112, turistas: 1344, ingresos: 47040 }
  ];

  const barData = [
    { tour: 'City Tour Lima', reservas: 45, ingresos: 15750 },
    { tour: t('dashboard.chart.tours.gastronomic'), reservas: 38, ingresos: 24700 },
    { tour: t('dashboard.chart.tours.palomino'), reservas: 32, ingresos: 27200 },
    { tour: 'Pachacámac', reservas: 28, ingresos: 12600 },
    { tour: t('dashboard.chart.tours.nazca'), reservas: 22, ingresos: 17600 }
  ];

  const pieData = [
    { name: t('dashboard.chart.categories.regular'), value: 65, color: '#1E40AF' },
    { name: t('dashboard.chart.categories.private'), value: 25, color: '#F59E0B' },
    { name: t('dashboard.chart.categories.transfers'), value: 10, color: '#10B981' }
  ];

  const kpiData = {
    totalReservas: {
      actual: 112,
      anterior: 98,
      crecimiento: 14.3
    },
    totalTuristas: {
      actual: 1344,
      anterior: 1176,
      crecimiento: 14.3
    },
    ingresosTotales: {
      actual: 47040,
      anterior: 41160,
      crecimiento: 14.3
    },
    tasaOcupacion: {
      actual: 87.5,
      anterior: 82.3,
      crecimiento: 6.3
    }
  };

  const summaryData = {
    popularTour: 'City Tour Lima',
    avgPerBooking: 420,
    bestDay: t('dashboard.chart.summary.saturday'),
    conversionRate: 23.5
  };

  const timeRangeOptions = [
    { value: 'week', label: t('dashboard.chart.timeRange.week') },
    { value: 'month', label: t('dashboard.chart.timeRange.month') },
    { value: 'quarter', label: t('dashboard.chart.timeRange.quarter') },
    { value: 'year', label: t('dashboard.chart.timeRange.year') }
  ];

  const chartTypeOptions = [
    { value: 'line', label: t('dashboard.chart.types.line') },
    { value: 'bar', label: t('dashboard.chart.types.bar') },
    { value: 'pie', label: t('dashboard.chart.types.pie') }
  ];

  return {
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
  };
};

export default useServiceChart;