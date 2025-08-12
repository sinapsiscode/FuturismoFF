import { useEffect, useState } from 'react';
import { ArrowTrendingUpIcon, CalendarIcon, CheckCircleIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import StatsCard from '../components/dashboard/StatsCard';
import ServiceChart from '../components/dashboard/ServiceChart';
import ExportPanel from '../components/dashboard/ExportPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(() => {
    // Estadísticas diferentes según el rol
    if (user?.role === 'guide') {
      return {
        myTours: 3,
        completedToday: 2,
        nextTour: '14:30',
        punctualityRate: 98.5
      };
    } else if (user?.role === 'agency') {
      return {
        activeServices: 12,
        completedToday: 8,
        totalRevenue: 15840,
        punctualityRate: 94.5,
        totalReservations: 127,
        totalTourists: 342,
        monthlyRevenue: 89500
      };
    } else { // admin
      return {
        activeServices: 48,
        totalAgencies: 12,
        totalGuides: 35,
        totalReservations: 1847,
        totalTourists: 4532,
        totalRevenue: 285700
      };
    }
  });

  // Datos para el gráfico de comparación mensual
  const getMonthlyData = () => {
    const months = i18n.language === 'es' 
      ? ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return [
      { month: months[0], reservations: 145, tourists: 367, revenue: 23400 },
      { month: months[1], reservations: 132, tourists: 342, revenue: 21800 },
      { month: months[2], reservations: 178, tourists: 445, revenue: 28900 },
      { month: months[3], reservations: 189, tourists: 478, revenue: 31200 },
      { month: months[4], reservations: 167, tourists: 423, revenue: 27600 },
      { month: months[5], reservations: 203, tourists: 512, revenue: 33500 },
      { month: months[6], reservations: 234, tourists: 589, revenue: 38700 },
      { month: months[7], reservations: 221, tourists: 567, revenue: 36800 },
      { month: months[8], reservations: 198, tourists: 501, revenue: 32400 },
      { month: months[9], reservations: 187, tourists: 465, revenue: 30100 },
      { month: months[10], reservations: 165, tourists: 418, revenue: 27200 },
      { month: months[11], reservations: 201, tourists: 509, revenue: 33100 }
    ];
  };
  
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Actualizar datos del gráfico cuando cambia el idioma
  useEffect(() => {
    setMonthlyData(getMonthlyData());
  }, [i18n.language]);

  // Obtener hora del día para el saludo
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning');
    if (hour < 18) return t('dashboard.goodAfternoon');
    return t('dashboard.goodEvening');
  };

  if (loading) {
    return <LoadingSpinner text={t('dashboard.loading')} />;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {user?.name || 'Usuario'}
        </h1>
        <p className="text-gray-600 mt-2">
          {t('dashboard.todaySummary')}
        </p>
      </div>

      {/* Stats Squares2X2Icon */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${user?.role === 'admin' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6 mb-8`}>
        {user?.role === 'guide' ? (
          <>
            <StatsCard
              title={t('dashboard.myToursToday')}
              value={stats.myTours}
              icon={CalendarIcon}
              trend="+1"
              color="primary"
            />
            <StatsCard
              title={t('dashboard.completed')}
              value={stats.completedToday}
              icon={CheckCircleIcon}
              trend="+2"
              color="success"
            />
            <StatsCard
              title={t('dashboard.nextTour')}
              value={stats.nextTour}
              icon={ClockIcon}
              color="secondary"
            />
            <StatsCard
              title={t('dashboard.myPunctuality')}
              value={`${stats.punctualityRate}%`}
              icon={ArrowTrendingUpIcon}
              trend="+0.5%"
              color="primary"
            />
          </>
        ) : user?.role === 'agency' ? (
          <>
            <StatsCard
              title={t('dashboard.totalReservations')}
              value={stats.totalReservations}
              icon={CalendarIcon}
              trend="+18%"
              color="primary"
            />
            <StatsCard
              title={t('dashboard.totalTourists')}
              value={stats.totalTourists}
              icon={UserGroupIcon}
              trend="+15%"
              color="success"
            />
            <StatsCard
              title={t('dashboard.totalIncome')}
              value={`$${stats.monthlyRevenue.toLocaleString()}`}
              icon={CurrencyDollarIcon}
              trend="+23%"
              color="secondary"
            />
            <StatsCard
              title={t('dashboard.punctuality')}
              value={`${stats.punctualityRate}%`}
              icon={ArrowTrendingUpIcon}
              trend="+2.5%"
              color="primary"
            />
          </>
        ) : (
          <>
            <StatsCard
              title={t('dashboard.totalReservations')}
              value={stats.totalReservations}
              icon={CalendarIcon}
              trend="+25%"
              color="primary"
            />
            <StatsCard
              title={t('dashboard.totalTourists')}
              value={stats.totalTourists}
              icon={UserGroupIcon}
              trend="+22%"
              color="success"
            />
            <StatsCard
              title={t('dashboard.totalIncome')}
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={CurrencyDollarIcon}
              trend="+28%"
              color="secondary"
            />
          </>
        )}  
      </div>

      {/* Monthly Comparison Charts - Only for Agency and Admin */}
      {(user?.role === 'agency' || user?.role === 'admin') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Reservas por Mes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.reservationsByMonth')}</h3>
              <ChartBarIcon className="w-5 h-5 text-primary-600" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [value, t('dashboard.reservations')]}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar 
                    dataKey="reservations" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Turistas por Mes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.touristsByMonth')}</h3>
              <UserGroupIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value) => [value, t('dashboard.tourists')]}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar 
                    dataKey="tourists" 
                    fill="#10B981" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Ingresos por Mes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.incomeByMonth')}</h3>
              <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value.toLocaleString()}`, t('dashboard.totalIncome')]}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Squares2X2Icon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Chart */}
        <div className="lg:col-span-2 space-y-6">
          <ServiceChart />
          
        </div>

        {/* Right Column - ChartBarIcon & Quick Actions */}
        <div className="space-y-6">
          {(user?.role === 'agency' || user?.role === 'admin') && <ExportPanel />}
          
          {/* Quick Access to Rewards - Solo para Agencias */}
          {user?.role === 'agency' && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">🎁 Sistema de Premios</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Link
                    to="/agency/rewards"
                    className="block bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 rounded-lg p-3 text-center"
                  >
                    🛍️ Tienda de Premios
                  </Link>
                  <Link
                    to="/test-rewards"
                    className="block bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 rounded-lg p-3 text-center"
                  >
                    🧪 Test Rewards
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Alerts or Announcements */}
    </div>
  );
};

export default Dashboard;