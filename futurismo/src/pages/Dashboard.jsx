import React from 'react';
import { CalendarIcon, CheckCircleIcon, ClockIcon, UserGroupIcon, CurrencyDollarIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import StatsCard from '../components/dashboard/StatsCard';
import ServiceChart from '../components/dashboard/ServiceChart';
import ExportPanel from '../components/dashboard/ExportPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import useDashboard from '../hooks/useDashboard';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  
  // Hook personalizado para dashboard (reemplaza datos hardcodeados)
  const {
    stats,
    loading,
    error,
    roleSpecificStats,
    refresh
  } = useDashboard();

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

      {/* Stats Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${user?.role === 'admin' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6 mb-8`}>
        {loading ? (
          <div className="col-span-full flex justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="col-span-full text-center text-red-600">
            <p>Error: {error}</p>
            <button onClick={refresh} className="btn btn-primary mt-2">Reintentar</button>
          </div>
        ) : (
          Object.entries(roleSpecificStats).map(([key, card]) => {
            // Función auxiliar para mapear iconos
            const getIconForType = (iconType) => {
              const iconMap = {
                calendar: CalendarIcon,
                clock: ClockIcon,
                star: CheckCircleIcon,
                dollar: CurrencyDollarIcon,
                service: ChartBarIcon,
                check: CheckCircleIcon,
                building: ExclamationTriangleIcon,
                user: UserGroupIcon
              };
              return iconMap[iconType] || CalendarIcon;
            };

            return (
              <StatsCard
                key={key}
                title={card.label}
                value={card.format === 'currency' ? `S/. ${card.value?.toLocaleString()}` : card.value}
                icon={getIconForType(card.icon)}
                trend="+2"
                color="primary"
              />
            );
          })
        )}
      </div>


      {/* Main Content - Different per role */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {user?.role === 'guide' ? (
          /* Guide specific content */
          <>
            <div className="lg:col-span-2 space-y-6">
              {/* Guide Personal Analytics - Solo Tours completados e Ingresos */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Análisis Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Tours completados</p>
                        <p className="text-2xl font-bold text-green-600">{stats.toursCompleted}</p>
                      </div>
                      <div className="text-green-600">✅</div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Ingresos del mes</p>
                        <p className="text-2xl font-bold text-purple-600">S/{stats.monthlyIncome}</p>
                      </div>
                      <div className="text-purple-600">💰</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico de Ingresos para Freelancer */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Ingresos por Mes</h3>
                  <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `S/${(value/1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        formatter={(value) => [`S/${value.toLocaleString()}`, 'Ingresos']}
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
            <div className="space-y-6">
              {/* Espacio para futuros widgets */}
            </div>
          </>
        ) : (
          /* Agency/Admin content */
          <>
            <div className="lg:col-span-2 space-y-6">
              <ServiceChart />
            </div>
            <div className="space-y-6">
              {(user?.role === 'agency' || user?.role === 'admin') && <ExportPanel />}
              
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;