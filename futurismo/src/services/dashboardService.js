import api from './api';

// Mock data temporalmente hasta conectar con el backend
const mockChartData = {
  lineData: [
    { name: 'Ene', reservas: 65, turistas: 780, ingresos: 27300 },
    { name: 'Feb', reservas: 78, turistas: 936, ingresos: 32760 },
    { name: 'Mar', reservas: 92, turistas: 1104, ingresos: 38640 },
    { name: 'Abr', reservas: 81, turistas: 972, ingresos: 34020 },
    { name: 'May', reservas: 98, turistas: 1176, ingresos: 41160 },
    { name: 'Jun', reservas: 105, turistas: 1260, ingresos: 44100 },
    { name: 'Jul', reservas: 112, turistas: 1344, ingresos: 47040 }
  ],
  barData: [
    { tour: 'City Tour Lima', reservas: 45, ingresos: 15750 },
    { tour: 'Tour Gastronómico', reservas: 38, ingresos: 24700 },
    { tour: 'Islas Palomino', reservas: 32, ingresos: 27200 },
    { tour: 'Pachacámac', reservas: 28, ingresos: 12600 },
    { tour: 'Líneas de Nazca', reservas: 22, ingresos: 17600 }
  ],
  pieData: [
    { name: 'Tours Regulares', value: 65, color: '#1E40AF' },
    { name: 'Tours Privados', value: 25, color: '#F59E0B' },
    { name: 'Traslados', value: 10, color: '#10B981' }
  ],
  kpiData: {
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
    }
  },
  summaryData: {
    popularTour: 'City Tour Lima',
    avgPerBooking: 420,
    bestDay: 'Sábados',
    conversionRate: 23.5
  }
};

const dashboardService = {
  // Obtener estadísticas del dashboard
  async getDashboardStats(timeRange = 'month') {
    try {
      // TODO: Cambiar por llamada real al backend
      // const response = await api.get(`/dashboard/stats?timeRange=${timeRange}`);
      // return response.data;
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockChartData;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Obtener KPIs principales
  async getKPIs(timeRange = 'month') {
    try {
      // TODO: Cambiar por llamada real al backend
      // const response = await api.get(`/dashboard/kpis?timeRange=${timeRange}`);
      // return response.data;
      
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockChartData.kpiData;
    } catch (error) {
      console.error('Error fetching KPIs:', error);
      throw error;
    }
  },

  // Obtener datos de gráficos
  async getChartData(chartType, timeRange = 'month') {
    try {
      // TODO: Cambiar por llamada real al backend
      // const response = await api.get(`/dashboard/charts/${chartType}?timeRange=${timeRange}`);
      // return response.data;
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      switch (chartType) {
        case 'line':
          return mockChartData.lineData;
        case 'bar':
          return mockChartData.barData;
        case 'pie':
          return mockChartData.pieData;
        default:
          return mockChartData.lineData;
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }
  },

  // Obtener resumen de estadísticas
  async getSummaryData(timeRange = 'month') {
    try {
      // TODO: Cambiar por llamada real al backend
      // const response = await api.get(`/dashboard/summary?timeRange=${timeRange}`);
      // return response.data;
      
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockChartData.summaryData;
    } catch (error) {
      console.error('Error fetching summary data:', error);
      throw error;
    }
  }
};

export default dashboardService;