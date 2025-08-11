import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  DocumentArrowDownIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  TicketIcon,
  MapIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import useStatisticsStore from '../../stores/statisticsStore';
import useReservationsStore from '../../stores/reservationsStore';
import useClientsStore from '../../stores/clientsStore';
import useProvidersStore from '../../stores/providersStore';
import toast from 'react-hot-toast';

function Reports() {
  // Store hooks
  const { loadDashboard, kpis, isLoading } = useStatisticsStore();
  const { reservations, fetchReservations } = useReservationsStore();
  const { clients, loadClients } = useClientsStore();
  const { providers, actions } = useProvidersStore();
  
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));

  useEffect(() => {
    loadReports();
  }, [startDate, endDate]);

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          loadDashboard(),
          fetchReservations(),
          loadClients(),
          actions.fetchProviders()
        ]);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    
    loadData();
  }, []);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    const today = new Date();
    
    switch(range) {
      case 'week':
        setStartDate(startOfWeek(today, { locale: es }));
        setEndDate(endOfWeek(today, { locale: es }));
        break;
      case 'month':
        setStartDate(startOfMonth(today));
        setEndDate(endOfMonth(today));
        break;
      case 'custom':
        // Mantener las fechas personalizadas
        break;
      default:
        break;
    }
  };

  const loadReports = async () => {
    try {
      await loadDashboard();
    } catch (error) {
      console.error('Error cargando reportes:', error);
      toast.error('Error al cargar los reportes');
    }
  };

  // Calcular estadísticas desde los datos de los stores
  const reportData = {
    totalBookings: reservations.length,
    totalRevenue: reservations.reduce((sum, res) => sum + (res.total || 0), 0),
    totalUsers: clients.length,
    totalProviders: providers.length,
    bookingsByStatus: {
      pending: reservations.filter(r => r.status === 'pending').length,
      confirmed: reservations.filter(r => r.status === 'confirmed').length,
      completed: reservations.filter(r => r.status === 'completed').length,
      cancelled: reservations.filter(r => r.status === 'cancelled').length
    },
    topDestinations: getTopDestinations(),
    topProviders: getTopProviders()
  };

  // Función para obtener top destinos
  function getTopDestinations() {
    const destinationCounts = {};
    reservations.forEach(reservation => {
      const destination = reservation.tourName || 'Destino desconocido';
      destinationCounts[destination] = (destinationCounts[destination] || 0) + 1;
    });
    
    return Object.entries(destinationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  // Función para obtener top proveedores
  function getTopProviders() {
    const providerStats = {};
    
    reservations.forEach(reservation => {
      const providerId = reservation.providerId || 'unknown';
      const provider = providers.find(p => p.id === providerId);
      const providerName = provider?.name || 'Proveedor desconocido';
      
      if (!providerStats[providerId]) {
        providerStats[providerId] = {
          providerId,
          providerName,
          count: 0,
          revenue: 0
        };
      }
      
      providerStats[providerId].count += 1;
      providerStats[providerId].revenue += reservation.total || 0;
    });
    
    return Object.values(providerStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }

  const exportToCSV = async () => {
    try {
      // Usar el servicio de estadísticas para exportar
      const blob = await useStatisticsStore.getState().exportToExcel({
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        includeDetails: true
      });
      
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast.success('Reporte exportado exitosamente');
      } else {
        // Fallback: exportar CSV básico
        const headers = ['Métrica', 'Valor'];
        const rows = [
          ['Total Reservas', reportData.totalBookings],
          ['Ingresos Totales', `S/. ${(reportData.totalRevenue || 0).toFixed(2)}`],
          ['Total Usuarios', reportData.totalUsers],
          ['Total Proveedores', reportData.totalProviders],
          '',
          ['Estados de Reservas', ''],
          ...Object.entries(reportData.bookingsByStatus || {}).map(([status, count]) => [status, count]),
          '',
          ['Top Destinos', ''],
          ...(reportData.topDestinations || []).map(d => [d.location, d.count]),
          '',
          ['Top Proveedores', ''],
          ...(reportData.topProviders || []).map(p => [p.providerName, `S/. ${(p.revenue || 0).toFixed(2)}`])
        ];

        const csvContent = [headers, ...rows]
          .map(row => row.join(','))
          .join('\n');

        const csvBlob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(csvBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast.success('Reporte CSV exportado exitosamente');
      }
    } catch (error) {
      console.error('Error al exportar reporte:', error);
      toast.error('Error al exportar el reporte');
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Selector de rango */}
            <div className="flex gap-2">
              <button
                onClick={() => handleDateRangeChange('week')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  dateRange === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => handleDateRangeChange('month')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  dateRange === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => handleDateRangeChange('custom')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  dateRange === 'custom'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Personalizado
              </button>
            </div>

            {/* Selector de fechas para rango personalizado */}
            {dateRange === 'custom' && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={format(startDate, 'yyyy-MM-dd')}
                  onChange={(e) => setStartDate(new Date(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={format(endDate, 'yyyy-MM-dd')}
                  onChange={(e) => setEndDate(new Date(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Botón exportar */}
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              Exportar Excel
            </button>
          </div>
        </div>

        <p className="mt-2 text-gray-600">
          Mostrando datos desde {format(startDate, 'dd/MM/yyyy', { locale: es })} hasta {format(endDate, 'dd/MM/yyyy', { locale: es })}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={TicketIcon}
              title="Total Reservas"
              value={reportData.totalBookings}
              subtitle="En el período seleccionado"
              color="blue"
            />
            <StatCard
              icon={CurrencyDollarIcon}
              title="Ingresos Totales"
              value={`S/. ${(reportData.totalRevenue || 0).toFixed(2)}`}
              subtitle="Suma de todas las reservas"
              color="green"
            />
            <StatCard
              icon={UserGroupIcon}
              title="Total Usuarios"
              value={reportData.totalUsers}
              subtitle="Usuarios registrados"
              color="purple"
            />
            <StatCard
              icon={MapIcon}
              title="Total Proveedores"
              value={reportData.totalProviders}
              subtitle="Proveedores activos"
              color="orange"
            />
          </div>

          {/* Gráficos y tablas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estados de reservas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estados de Reservas</h2>
              <div className="space-y-3">
                {Object.entries(reportData.bookingsByStatus || {}).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-gray-700 capitalize">{status}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top destinos */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Destinos</h2>
              <div className="space-y-3">
                {(reportData.topDestinations || []).map((destination, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{destination.location}</span>
                    <span className="font-semibold">{destination.count} reservas</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top proveedores */}
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Proveedores por Ingresos</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reservas</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {(reportData.topProviders || []).map((provider, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-gray-900">{provider.providerName}</td>
                        <td className="px-4 py-3 text-gray-700">{provider.count}</td>
                        <td className="px-4 py-3 text-gray-900 font-semibold">
                          S/. {(provider.revenue || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;