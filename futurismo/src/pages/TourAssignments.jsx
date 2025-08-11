import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  BuildingOfficeIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';
import useToursStore from '../stores/toursStore';
import useGuidesStore from '../stores/guidesStore';
import useClientsStore from '../stores/clientsStore';
import { formatters } from '../utils/formatters';
import toast from 'react-hot-toast';

const TourAssignments = () => {
  const [selectedTour, setSelectedTour] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignmentType, setAssignmentType] = useState('guide'); // 'guide' o 'agency'
  const [selectedGuide, setSelectedGuide] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('');
  const [validateCompetences, setValidateCompetences] = useState(true);
  const [availableGuides, setAvailableGuides] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stores
  const { 
    tours, 
    loadTours, 
    assignGuideToTour, 
    assignTourToAgency,
    getAvailableGuidesForTour,
    removeAssignment,
    isLoading 
  } = useToursStore();
  
  const { guides, fetchGuides } = useGuidesStore();
  const { clients, initialize: initializeClients } = useClientsStore();

  // Cargar datos al montar
  useEffect(() => {
    const loadData = async () => {
      try {
        await loadTours();
        await fetchGuides();
        await initializeClients();
      } catch (error) {
        console.error('Error cargando datos:', error);
        toast.error('Error al cargar los datos');
      }
    };
    
    loadData();
  }, []);

  // Filtrar tours
  const filteredTours = tours.filter(tour => {
    if (filter === 'pending' && tour.assignedGuide) return false;
    if (filter === 'assigned' && !tour.assignedGuide) return false;
    if (filter === 'today') {
      const today = new Date().toDateString();
      const tourDate = new Date(tour.date || tour.createdAt).toDateString();
      return today === tourDate;
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return tour.name.toLowerCase().includes(term) ||
             tour.code.toLowerCase().includes(term) ||
             tour.category.toLowerCase().includes(term);
    }
    
    return true;
  });

  // Contar tours por estado
  const getCounts = () => {
    const counts = {
      total: tours.length,
      pending: tours.filter(t => !t.assignedGuide).length,
      assigned: tours.filter(t => t.assignedGuide).length,
      today: tours.filter(t => {
        const today = new Date().toDateString();
        const tourDate = new Date(t.date || t.createdAt).toDateString();
        return today === tourDate;
      }).length
    };
    return counts;
  };

  const counts = getCounts();

  // Abrir modal de asignación
  const handleOpenAssignModal = async (tour) => {
    setSelectedTour(tour);
    setShowAssignModal(true);
    setSelectedGuide('');
    setSelectedAgency('');
    
    // Cargar guías disponibles
    if (tour.date) {
      setCheckingAvailability(true);
      try {
        const result = await getAvailableGuidesForTour(tour.id, tour.date);
        setAvailableGuides(result.guides || []);
      } catch (error) {
        console.error('Error cargando guías disponibles:', error);
        toast.error('Error al cargar guías disponibles');
      } finally {
        setCheckingAvailability(false);
      }
    }
  };

  // Manejar asignación
  const handleAssign = async () => {
    if (!selectedTour) return;

    try {
      if (assignmentType === 'guide') {
        if (!selectedGuide) {
          toast.error('Por favor selecciona un guía');
          return;
        }

        await assignGuideToTour(selectedTour.id, selectedGuide, {
          validateCompetences,
          role: 'principal'
        });
        
        toast.success('Guía asignado correctamente');
      } else {
        if (!selectedAgency) {
          toast.error('Por favor selecciona una agencia');
          return;
        }

        await assignTourToAgency(selectedTour.id, selectedAgency, {
          commission: 10,
          contractType: 'standard'
        });
        
        toast.success('Tour asignado a agencia correctamente');
      }

      setShowAssignModal(false);
      setSelectedTour(null);
    } catch (error) {
      toast.error(error.message || 'Error al realizar la asignación');
    }
  };

  // Remover asignación
  const handleRemoveAssignment = async (tour, type = 'guide') => {
    if (!confirm(`¿Estás seguro de remover la asignación ${type === 'guide' ? 'del guía' : 'de la agencia'}?`)) {
      return;
    }

    try {
      await removeAssignment(tour.id, type);
      toast.success('Asignación removida correctamente');
    } catch (error) {
      toast.error('Error al remover la asignación');
    }
  };

  if (isLoading && tours.length === 0) {
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
        <p className="text-gray-600">Gestiona las asignaciones de guías y agencias para los tours</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Tours</p>
              <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Sin Asignar</p>
              <p className="text-2xl font-bold text-gray-900">{counts.pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Asignados</p>
              <p className="text-2xl font-bold text-gray-900">{counts.assigned}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Hoy</p>
              <p className="text-2xl font-bold text-gray-900">{counts.today}</p>
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
                { key: 'pending', label: 'Sin Asignar' },
                { key: 'assigned', label: 'Asignados' },
                { key: 'today', label: 'Hoy' }
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
              placeholder="Buscar por nombre, código o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTours.map((tour) => (
          <div key={tour.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Tour Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{tour.name}</h3>
                  <p className="text-sm text-gray-500">Código: {tour.code}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  tour.assignedGuide 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {tour.assignedGuide ? 'Asignado' : 'Pendiente'}
                </span>
              </div>

              {/* Tour Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {formatters.formatDate(tour.date || tour.createdAt)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  {tour.duration} horas
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  Capacidad: {tour.capacity} personas
                </div>
              </div>

              {/* Asignaciones actuales */}
              {(tour.assignedGuide || tour.assignedAgency) && (
                <div className="border-t pt-4 mb-4 space-y-2">
                  {tour.assignedGuide && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <UserIcon className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-gray-700">Guía: {tour.assignedGuide.name}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveAssignment(tour, 'guide')}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {tour.assignedAgency && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <BuildingOfficeIcon className="h-4 w-4 mr-2 text-purple-600" />
                        <span className="text-gray-700">Agencia: {tour.assignedAgency.name}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveAssignment(tour, 'agency')}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                {!tour.assignedGuide && (
                  <button
                    onClick={() => handleOpenAssignModal(tour)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Asignar
                  </button>
                )}
                {tour.assignedGuide && !tour.assignedAgency && (
                  <button
                    onClick={() => {
                      setSelectedTour(tour);
                      setAssignmentType('agency');
                      setShowAssignModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Asignar a Agencia
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTours.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay tours</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'No se encontraron tours con los filtros aplicados.' : 'No hay tours disponibles.'}
          </p>
        </div>
      )}

      {/* Modal de Asignación */}
      {showAssignModal && selectedTour && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Asignar Tour: {selectedTour.name}
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Tipo de asignación */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Asignación
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setAssignmentType('guide')}
                  className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                    assignmentType === 'guide'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <UserIcon className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                  <span className="text-sm font-medium">Asignar Guía</span>
                </button>
                <button
                  onClick={() => setAssignmentType('agency')}
                  className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                    assignmentType === 'agency'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <BuildingOfficeIcon className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                  <span className="text-sm font-medium">Asignar Agencia</span>
                </button>
              </div>
            </div>

            {/* Selección de Guía */}
            {assignmentType === 'guide' && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Guía
                  </label>
                  
                  {checkingAvailability ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Verificando disponibilidad...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {availableGuides.length > 0 ? (
                        availableGuides.map((guide) => (
                          <label
                            key={guide.id}
                            className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedGuide === guide.id
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <input
                              type="radio"
                              value={guide.id}
                              checked={selectedGuide === guide.id}
                              onChange={(e) => setSelectedGuide(e.target.value)}
                              className="sr-only"
                            />
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{guide.name}</p>
                                <p className="text-sm text-gray-500">
                                  {guide.languages.join(', ')} • Rating: {guide.rating}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {guide.toursCompleted} tours completados
                                </p>
                              </div>
                              {guide.availability === 'busy' && (
                                <span className="text-xs text-orange-600">
                                  Ocupado hasta {guide.busyUntil}
                                </span>
                              )}
                              {guide.availability === 'available' && (
                                <CheckIcon className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                          </label>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <InformationCircleIcon className="h-8 w-8 mx-auto mb-2" />
                          <p>No hay guías disponibles para esta fecha</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Validar competencias */}
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={validateCompetences}
                      onChange={(e) => setValidateCompetences(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Validar competencias y certificaciones del guía
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* Selección de Agencia */}
            {assignmentType === 'agency' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Agencia
                </label>
                <select
                  value={selectedAgency}
                  onChange={(e) => setSelectedAgency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Selecciona una agencia</option>
                  {clients
                    .filter(client => client.type === 'agency')
                    .map((agency) => (
                      <option key={agency.id} value={agency.id}>
                        {agency.name} - {agency.contact}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAssign}
                disabled={
                  (assignmentType === 'guide' && !selectedGuide) ||
                  (assignmentType === 'agency' && !selectedAgency)
                }
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirmar Asignación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourAssignments;