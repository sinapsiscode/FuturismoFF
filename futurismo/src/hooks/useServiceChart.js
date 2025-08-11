import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dashboardService from '../services/dashboardService';

const useServiceChart = () => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  // Estados para los datos
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [kpiData, setKpiData] = useState({
    totalReservas: { actual: 0, anterior: 0, crecimiento: 0 },
    totalTuristas: { actual: 0, anterior: 0, crecimiento: 0 },
    ingresosTotales: { actual: 0, anterior: 0, crecimiento: 0 }
  });
  const [summaryData, setSummaryData] = useState({
    popularTour: '',
    avgPerBooking: 0,
    bestDay: '',
    conversionRate: 0
  });

  // Cargar datos cuando cambia el timeRange
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const stats = await dashboardService.getDashboardStats(timeRange);
        
        // Traducir los nombres de los meses
        const translatedLineData = stats.lineData.map(item => ({
          ...item,
          name: t(`dashboard.chart.months.${item.name.toLowerCase()}`)
        }));
        
        // Traducir los nombres de tours y categorías
        const translatedBarData = stats.barData.map(item => ({
          ...item,
          tour: item.tour === 'Tour Gastronómico' ? t('dashboard.chart.tours.gastronomic') :
                item.tour === 'Islas Palomino' ? t('dashboard.chart.tours.palomino') :
                item.tour === 'Líneas de Nazca' ? t('dashboard.chart.tours.nazca') :
                item.tour
        }));
        
        const translatedPieData = stats.pieData.map(item => ({
          ...item,
          name: item.name === 'Tours Regulares' ? t('dashboard.chart.categories.regular') :
                item.name === 'Tours Privados' ? t('dashboard.chart.categories.private') :
                item.name === 'Traslados' ? t('dashboard.chart.categories.transfers') :
                item.name
        }));
        
        setLineData(translatedLineData);
        setBarData(translatedBarData);
        setPieData(translatedPieData);
        setKpiData(stats.kpiData);
        setSummaryData({
          ...stats.summaryData,
          bestDay: stats.summaryData.bestDay === 'Sábados' ? t('dashboard.chart.summary.saturday') : stats.summaryData.bestDay
        });
      } catch (err) {
        setError(err.message);
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, t]);

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
    chartTypeOptions,
    loading,
    error
  };
};

export default useServiceChart;