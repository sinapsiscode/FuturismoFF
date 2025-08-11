import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import useReservationsStore from '../stores/reservationsStore';
import useClientsStore from '../stores/clientsStore';
import { formatters } from '../utils/formatters';

const TourAssignments = () => {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Obtener datos de los stores
  const { reservations, fetchReservations, isLoading } = useReservationsStore();
  const { clients, initialize: initializeClients } = useClientsStore();

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchReservations({ status: ['pending', 'urgent', 'assigned'] });
        await initializeClients();
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Enriquecer reservaciones con datos de cliente
  const enrichedReservations = reservations.map(reservation => {
    const client = clients.find(c => c.id === reservation.clientId) || {};
    return {
      ...reservation,
      agency: {
        id: client.id,
        name: client.name || 'Cliente desconocido',
        contact: client.contact || '',
        phone: client.phone || '',
        email: client.email || ''
      },
      groupSize: (reservation.adults || 0) + (reservation.children || 0),
      priority: reservation.status === 'urgent' ? 'urgent' : 
                reservation.status === 'confirmed' ? 'high' : 'medium'
    };
  });

  // Filtrar reservaciones
  const filteredReservations = enrichedReservations.filter(reservation => {
    if (filter === 'pending' && reservation.status !== 'pending') return false;
    if (filter === 'assigned' && reservation.status !== 'assigned') return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return reservation.agency.name.toLowerCase().includes(term) ||
             reservation.tourName?.toLowerCase().includes(term);
    }
    return true;
  });

  const getFilteredCount = (filterType) => {
    return enrichedReservations.filter(r => {
      if (filterType === 'pending') return r.status === 'pending';
      if (filterType === 'assigned') return r.status === 'assigned';
      if (filterType === 'tomorrow') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return new Date(r.date).toDateString() === tomorrow.toDateString();
      }
      return true;
    }).length;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Asignación de Tours</h1>
        <p className="text-gray-600">Gestiona las asignaciones de guías y recursos para los tours</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{getFilteredCount('pending')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Asignados</p>
              <p className="text-2xl font-bold text-gray-900">{getFilteredCount('assigned')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Mañana</p>
              <p className="text-2xl font-bold text-gray-900">{getFilteredCount('tomorrow')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{enrichedReservations.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              {[
                { key: 'all', label: 'Todos' },
                { key: 'pending', label: 'Pendientes' },
                { key: 'assigned', label: 'Asignados' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por agencia o tour..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Reservaciones ({filteredReservations.length})
          </h3>
        </div>
        
        <div className="p-6">
          {filteredReservations.length > 0 ? (
            <div className="space-y-4">
              {filteredReservations.map((reservation) => (
                <div key={reservation.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CalendarIcon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {reservation.tourName || 'Tour no especificado'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {reservation.agency.name} • {reservation.groupSize} personas
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatters.formatDate(reservation.date)} • {reservation.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        reservation.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : reservation.status === 'assigned'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {reservation.status === 'pending' ? 'Pendiente' : 
                         reservation.status === 'assigned' ? 'Asignado' : reservation.status}
                      </span>
                      <button
                        onClick={() => setSelectedReservation(reservation)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Gestionar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reservas</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'No se encontraron reservas con los filtros aplicados.' : 'No hay reservas pendientes de asignación.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal placeholder para AssignmentManager */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Gestionar Asignación
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Funcionalidad de asignación en desarrollo para: {selectedReservation.tourName}
            </p>
            <button
              onClick={() => setSelectedReservation(null)}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourAssignments;