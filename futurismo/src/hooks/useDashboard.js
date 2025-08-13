import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import useAuthStore from '../stores/authStore';

const useDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);

  // Cargar estadísticas del dashboard
  const loadStats = async () => {
    if (!user?.id || !user?.role) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await dashboardService.getStats(user.id, user.role);
      
      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error(response.message || 'Error al cargar estadísticas');
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos mensuales para gráficos
  const loadMonthlyData = async () => {
    if (!user?.id || !user?.role) return;

    try {
      const response = await dashboardService.getMonthlyData(user.id, user.role);
      
      if (response.success) {
        setMonthlyData(response.data);
      }
    } catch (err) {
      console.error('Error loading monthly data:', err);
    }
  };

  // Formatear próximo tour para guides
  const getFormattedNextTour = () => {
    if (user?.role !== 'guide' || !stats?.nextTour) {
      return '0';
    }

    const nextTour = new Date(stats.nextTour);
    const day = nextTour.getDate().toString().padStart(2, '0');
    const month = (nextTour.getMonth() + 1).toString().padStart(2, '0');
    const year = nextTour.getFullYear().toString().slice(-2);
    
    return `${day}-${month}-${year}`;
  };

  // Obtener datos específicos según el rol
  const getRoleSpecificStats = () => {
    if (!stats) return {};

    switch (user?.role) {
      case 'guide':
        return {
          card1: { value: stats.toursThisWeek, label: 'Tours esta semana', icon: 'calendar' },
          card2: { value: getFormattedNextTour(), label: 'Siguiente tour', icon: 'clock' },
          card3: { value: stats.personalRating?.toFixed(1), label: 'Rating personal', icon: 'star' },
          card4: { value: stats.monthlyIncome, label: 'Ingresos mensuales', icon: 'dollar', format: 'currency' }
        };

      case 'agency':
        return {
          card1: { value: stats.activeServices, label: 'Servicios activos', icon: 'service' },
          card2: { value: stats.completedToday, label: 'Completados hoy', icon: 'check' },
          card3: { value: stats.totalRevenue, label: 'Ingresos totales', icon: 'dollar', format: 'currency' },
          card4: { value: stats.punctualityRate?.toFixed(1), label: 'Puntualidad %', icon: 'clock' }
        };

      case 'admin':
      default:
        return {
          card1: { value: stats.activeServices, label: 'Servicios activos', icon: 'service' },
          card2: { value: stats.totalAgencies, label: 'Agencias totales', icon: 'building' },
          card3: { value: stats.totalGuides, label: 'Guías totales', icon: 'user' },
          card4: { value: stats.totalRevenue, label: 'Ingresos totales', icon: 'dollar', format: 'currency' }
        };
    }
  };

  // Cargar datos al montar y cuando cambie el usuario
  useEffect(() => {
    if (user?.id) {
      loadStats();
      loadMonthlyData();
    }
  }, [user?.id, user?.role]);

  return {
    stats,
    loading,
    error,
    monthlyData,
    roleSpecificStats: getRoleSpecificStats(),
    getFormattedNextTour,
    refresh: () => {
      loadStats();
      loadMonthlyData();
    }
  };
};

export default useDashboard;