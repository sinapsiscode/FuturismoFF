import { useState } from 'react';
import { CalendarIcon, ClockIcon, UserGroupIcon, MapPinIcon, CurrencyDollarIcon, EllipsisVerticalIcon, EyeIcon, PencilIcon, TrashIcon, DocumentTextIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { formatters } from '../../utils/formatters';
import { useReservationsStore } from '../../stores/reservationsStore';
import { useAuthStore } from '../../stores/authStore';
import ReservationDetail from './ReservationDetail';
import ExportModal from '../common/ExportModal';
import exportService from '../../services/exportService';
import ServiceRatingModal from '../ratings/ServiceRatingModal';
import ResponsiveTable from '../common/ResponsiveTable';
import toast from 'react-hot-toast';

const ReservationList = () => {
  const { reservations } = useReservationsStore();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [minPassengers, setMinPassengers] = useState('');
  const [maxPassengers, setMaxPassengers] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showActions, setShowActions] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const itemsPerPage = 10;

  // Mock data para demostración
  const mockReservations = [
    {
      id: 'RES001',
      tourName: 'City Tour Lima Histórica',
      clientName: 'Juan Pérez',
      clientPhone: '+51 987654321',
      date: new Date('2024-02-15'),
      time: '09:00',
      adults: 2,
      children: 1,
      total: 105,
      status: 'confirmada',
      pickupLocation: 'Hotel Marriott Miraflores',
      createdAt: new Date('2024-02-01'),
      paymentStatus: 'pagado',
      tourists: [
        {
          id: '1',
          name: 'Juan Pérez',
          documentType: 'DNI',
          documentNumber: '12345678',
          phone: '+51 987654321'
        },
        {
          id: '2',
          name: 'María Pérez',
          documentType: 'DNI',
          documentNumber: '87654321',
          phone: '+51 987654321'
        },
        {
          id: '3',
          name: 'Carlos García',
          documentType: 'DNI',
          documentNumber: '11223344',
          phone: '+51 987654322'
        }
      ],
      groups: [
        {
          representativeName: 'Juan Pérez',
          representativePhone: '+51 987654321',
          companionsCount: 2
        },
        {
          representativeName: 'Carlos García',
          representativePhone: '+51 987654322',
          companionsCount: 1
        }
      ],
      isRated: false
    },
    {
      id: 'RES002',
      tourName: 'Tour Gastronómico Miraflores',
      clientName: 'María García',
      clientPhone: '+51 976543210',
      date: new Date('2024-02-16'),
      time: '12:00',
      adults: 4,
      children: 0,
      total: 260,
      status: 'pendiente',
      pickupLocation: 'Parque Kennedy',
      createdAt: new Date('2024-02-05'),
      paymentStatus: 'pendiente',
      tourists: [
        {
          id: '4',
          name: 'María García',
          documentType: 'DNI',
          documentNumber: '22334455',
          phone: '+51 976543210'
        },
        {
          id: '5',
          name: 'Ana García',
          documentType: 'DNI',
          documentNumber: '33445566',
          phone: '+51 976543210'
        },
        {
          id: '6',
          name: 'Luis García',
          documentType: 'DNI',
          documentNumber: '44556677',
          phone: '+51 976543210'
        },
        {
          id: '7',
          name: 'Pedro García',
          documentType: 'DNI',
          documentNumber: '55667788',
          phone: '+51 976543210'
        }
      ],
      isRated: false
    },
    {
      id: 'RES003',
      tourName: 'Islas Palomino',
      clientName: 'Carlos Rodríguez',
      clientPhone: '+51 965432198',
      date: new Date('2024-02-18'),
      time: '06:00',
      adults: 3,
      children: 2,
      total: 340,
      status: 'completada',
      pickupLocation: 'Hotel Hilton',
      createdAt: new Date('2024-02-08'),
      paymentStatus: 'pagado',
      tourists: [
        {
          id: '8',
          name: 'Carlos Rodríguez',
          documentType: 'DNI',
          documentNumber: '66778899',
          phone: '+51 965432198'
        },
        {
          id: '9',
          name: 'Sofia Rodríguez',
          documentType: 'DNI',
          documentNumber: '77889900',
          phone: '+51 965432198'
        },
        {
          id: '10',
          name: 'Miguel Rodríguez',
          documentType: 'DNI',
          documentNumber: '88990011',
          phone: '+51 965432198'
        },
        {
          id: '11',
          name: 'Elena Rodríguez',
          documentType: 'DNI',
          documentNumber: '99001122',
          phone: '+51 965432198'
        },
        {
          id: '12',
          name: 'Pablo Rodríguez',
          documentType: 'DNI',
          documentNumber: '00112233',
          phone: '+51 965432198'
        }
      ],
      isRated: false
    },
    {
      id: 'RES004',
      tourName: 'Pachacámac y Barranco',
      clientName: 'Ana López',
      clientPhone: '+51 954321876',
      date: new Date('2024-02-14'),
      time: '14:00',
      adults: 2,
      children: 0,
      total: 90,
      status: 'cancelada',
      pickupLocation: 'JW Marriott',
      createdAt: new Date('2024-01-28'),
      paymentStatus: 'reembolsado',
      tourists: [
        {
          id: '13',
          name: 'Ana López',
          documentType: 'DNI',
          documentNumber: '11223344',
          phone: '+51 954321876'
        },
        {
          id: '14',
          name: 'Roberto López',
          documentType: 'DNI',
          documentNumber: '22334455',
          phone: '+51 954321876'
        }
      ],
      isRated: false
    }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pendiente: 'badge-yellow',
      confirmada: 'badge-green',
      cancelada: 'badge-red',
      completada: 'badge-blue'
    };
    return badges[status] || 'badge-gray';
  };
  
  const getStatusLabel = (status) => {
    const labels = {
      pendiente: t('reservations.pending'),
      confirmada: t('reservations.confirmed'),
      cancelada: t('reservations.cancelled'),
      completada: t('reservations.completed')
    };
    return labels[status] || status;
  };

  const getPaymentBadge = (status) => {
    const badges = {
      pendiente: 'badge-yellow',
      pagado: 'badge-green',
      reembolsado: 'badge-blue'
    };
    return badges[status] || 'badge-gray';
  };
  
  const getPaymentLabel = (status) => {
    const labels = {
      pendiente: t('reservations.pending'),
      pagado: t('reservations.paid'),
      reembolsado: t('reservations.refunded')
    };
    return labels[status] || status;
  };

  // Filtrar reservaciones
  const filteredReservations = mockReservations.filter(reservation => {
    const matchesSearch = 
      reservation.tourName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    
    // Filtro por fechas
    let matchesDate = true;
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      matchesDate = matchesDate && reservation.date >= fromDate;
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      matchesDate = matchesDate && reservation.date <= toDate;
    }
    
    // Filtro por cliente
    const matchesCustomer = !customerFilter || 
      reservation.clientName.toLowerCase().includes(customerFilter.toLowerCase());
    
    // Filtro por cantidad de pasajeros
    const totalPassengers = reservation.adults + reservation.children;
    let matchesPassengers = true;
    if (minPassengers) {
      matchesPassengers = matchesPassengers && totalPassengers >= parseInt(minPassengers);
    }
    if (maxPassengers) {
      matchesPassengers = matchesPassengers && totalPassengers <= parseInt(maxPassengers);
    }
    
    return matchesSearch && matchesStatus && matchesDate && matchesCustomer && matchesPassengers;
  });

  // Paginación
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReservations = filteredReservations.slice(startIndex, startIndex + itemsPerPage);

  // Estadísticas para el modal de exportación
  const exportStats = {
    totalReservations: filteredReservations.length,
    totalTourists: filteredReservations.reduce((sum, res) => sum + res.adults + res.children, 0),
    totalRevenue: filteredReservations.reduce((sum, res) => sum + res.total, 0),
    avgTicket: filteredReservations.length > 0 ? 
      filteredReservations.reduce((sum, res) => sum + res.total, 0) / filteredReservations.length : 0
  };

  const handleViewDetail = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetail(true);
    setShowActions(null);
  };

  const handleEdit = (reservation) => {
    // Implementar edición
    console.log('Editar reserva:', reservation.id);
    setShowActions(null);
  };

  const handleDelete = (reservation) => {
    // Implementar eliminación
    if (window.confirm(t('search.deleteConfirm'))) {
      console.log('Eliminar reserva:', reservation.id);
    }
    setShowActions(null);
  };

  const handleRateTourists = (reservation) => {
    if (!reservation.tourists || reservation.tourists.length === 0) {
      toast.error('No hay turistas registrados para valorar');
      return;
    }
    
    setSelectedService({
      id: reservation.id,
      name: reservation.tourName,
      date: reservation.date,
      time: reservation.time
    });
    setShowRatingModal(true);
    setShowActions(null);
  };

  const handleRatingsCompleted = (allRatings) => {
    console.log('Valoraciones completadas:', allRatings);
    
    // En una implementación real, aquí se guardarían las valoraciones en la base de datos
    // y se actualizaría el estado de la reserva como "valorada"
    
    setShowRatingModal(false);
    setSelectedService(null);
    
    // Simular actualización del estado (en producción esto vendría del backend)
    // mockReservations.find(r => r.id === selectedService.id).isRated = true;
  };

  const canRateService = (reservation) => {
    return reservation.status === 'completada' && !reservation.isRated;
  };

  const handleExport = () => {
    // Verificar si hay datos para exportar
    if (filteredReservations.length === 0) {
      alert('⚠️ No hay reservas para exportar con el filtro actual.');
      return;
    }
    
    // Abrir el modal de exportación
    setShowExportModal(true);
  };

  const handleModalExport = async (format) => {
    try {
      // Mapear el filtro actual al formato del servicio
      let filterStatus = 'all';
      if (statusFilter !== 'all') {
        filterStatus = statusFilter;
      }
      
      // Exportar usando el servicio
      exportService.exportData(format, filterStatus);
      
      // Obtener estadísticas para el mensaje
      const stats = exportService.getFilteredStats(filterStatus);
      const statusLabel = filterStatus === 'all' ? 'Todas las reservas' : 
                         filterStatus === 'confirmada' ? 'Solo confirmadas' :
                         filterStatus === 'pendiente' ? 'Solo pendientes' :
                         filterStatus === 'cancelada' ? 'Solo canceladas' : 'Reservas filtradas';
      
      // Mostrar mensaje de éxito
      setTimeout(() => {
        alert(`✅ ¡Exportación completada exitosamente!\n\n` +
              `📊 Datos exportados:\n` +
              `• ${stats.totalReservations} reservas (${statusLabel})\n` +
              `• ${stats.totalTourists} turistas\n` +
              `• $${stats.totalRevenue.toLocaleString()} en ingresos\n` +
              `• Formato: ${format.toUpperCase()}\n\n` +
              `📁 El archivo se descargó automáticamente.`);
      }, 300);
      
    } catch (error) {
      console.error('Error al exportar reservas:', error);
      throw new Error(`Error al exportar: ${error.message}`);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow">
        {/* Header con búsqueda y filtros */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col gap-4">
            {/* Primera fila: Búsqueda y Exportar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t('search.searchByTour')}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <button 
                onClick={handleExport}
                className="btn btn-outline flex items-center gap-2 hover:bg-primary-50 hover:border-primary-500"
                title="Exportar reservas filtradas en Excel, PDF o CSV"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                {t('search.export')} ({filteredReservations.length})
              </button>
            </div>

            {/* Segunda fila: Filtros */}
            <div className="flex flex-wrap gap-3">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">{t('search.allStatuses')}</option>
                <option value="pendiente">{t('reservations.pending')}</option>
                <option value="confirmada">{t('reservations.confirmed')}</option>
                <option value="cancelada">{t('reservations.cancelled')}</option>
                <option value="completada">{t('reservations.completed')}</option>
              </select>

              <input
                type="date"
                placeholder="Fecha desde"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                title={t('search.dateFrom')}
              />

              <input
                type="date"
                placeholder="Fecha hasta"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                title={t('search.dateTo')}
              />

              <input
                type="text"
                placeholder={t('search.client')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-40"
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
              />

              <input
                type="number"
                placeholder={t('search.minPassengers')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-32"
                value={minPassengers}
                onChange={(e) => setMinPassengers(e.target.value)}
                min="1"
              />

              <input
                type="number"
                placeholder={t('search.maxPassengers')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-32"
                value={maxPassengers}
                onChange={(e) => setMaxPassengers(e.target.value)}
                min="1"
              />

              {/* Botón para limpiar filtros */}
              {(dateFrom || dateTo || customerFilter || minPassengers || maxPassengers) && (
                <button
                  onClick={() => {
                    setDateFrom('');
                    setDateTo('');
                    setCustomerFilter('');
                    setMinPassengers('');
                    setMaxPassengers('');
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-1"
                  title={t('search.clear')}
                >
                  <XMarkIcon className="w-4 h-4" />
                  {t('search.clear')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabla de reservaciones */}
        <ResponsiveTable>
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {t('search.code')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {t('search.tourClient')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {t('search.dateTime')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {t('search.passengers')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {t('search.total')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {t('reservations.status')}
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {t('reservations.payment')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('search.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{reservation.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{reservation.tourName}</p>
                      <p className="text-sm text-gray-500">{reservation.clientName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-gray-900">
                        <CalendarIcon className="w-4 h-4" />
                        {formatters.formatDate(reservation.date)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <ClockIcon className="w-4 h-4" />
                        {reservation.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-sm">
                      <UserGroupIcon className="w-4 h-4 text-gray-400" />
                      <span>
                        {reservation.adults}
                        {reservation.children > 0 && ` + ${reservation.children}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      ${reservation.total}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatusBadge(reservation.status)}`}>
                      {getStatusLabel(reservation.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getPaymentBadge(reservation.paymentStatus)}`}>
                      {getPaymentLabel(reservation.paymentStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === reservation.id ? null : reservation.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <EllipsisVerticalIcon className="w-5 h-5" />
                      </button>

                      {showActions === reservation.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={() => handleViewDetail(reservation)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <EyeIcon className="w-4 h-4" />
                            {t('search.viewDetails')}
                          </button>
                          
                          {/* Botón de valoración - solo para servicios completados */}
                          {canRateService(reservation) && (
                            <button
                              onClick={() => handleRateTourists(reservation)}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                            >
                              <HeartIcon className="w-4 h-4" />
                              {t('search.rateTourists')} ({reservation.tourists?.length || 0})
                            </button>
                          )}
                          {/* Solo agencias pueden editar sus propias reservas */}
                          {user?.role === 'agency' && (
                            <>
                              <button
                                onClick={() => handleEdit(reservation)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <PencilIcon className="w-4 h-4" />
                                {t('search.edit')}
                              </button>
                              <button
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <DocumentTextIcon className="w-4 h-4" />
                                {t('search.generateVoucher')}
                              </button>
                            </>
                          )}
                          {/* Solo admins pueden eliminar */}
                          {user?.role === 'admin' && (
                            <>
                              <hr className="my-1" />
                              <button
                                onClick={() => handleDelete(reservation)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <TrashIcon className="w-4 h-4" />
                                {t('search.delete')}
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ResponsiveTable>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {t('search.showing')} {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredReservations.length)} {t('search.of')} {filteredReservations.length} {t('search.reservationsPlural')}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === index + 1
                        ? 'bg-primary-500 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalle */}
      {showDetail && (
        <ReservationDetail 
          reservation={selectedReservation}
          onClose={() => {
            setShowDetail(false);
            setSelectedReservation(null);
          }}
        />
      )}

      {/* Modal de exportación */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleModalExport}
        reservationCount={filteredReservations.length}
        filterStatus={statusFilter}
        stats={exportStats}
      />

      {/* Modal de valoración de turistas */}
      {showRatingModal && selectedService && (
        <ServiceRatingModal
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedService(null);
          }}
          service={selectedService}
          tourists={mockReservations.find(r => r.id === selectedService.id)?.tourists || []}
          onAllRatingsCompleted={handleRatingsCompleted}
        />
      )}

    </>
  );
};

export default ReservationList;