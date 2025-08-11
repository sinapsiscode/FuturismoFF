import React, { useState, useEffect } from 'react';
import {
  TruckIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CameraIcon,
  MapPinIcon,
  CalendarIcon,
  ChartBarIcon,
  CogIcon,
  BoltIcon,
  FuelCellIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import useVehiclesStore from '../stores/vehiclesStore';
import { 
  VEHICLE_STATUS,
  VEHICLE_STATUS_LABELS,
  VEHICLE_STATUS_COLORS,
  VEHICLE_TYPES,
  VEHICLE_TYPE_LABELS,
  VEHICLE_CAPACITY,
  FUEL_TYPES,
  FUEL_TYPE_LABELS,
  VEHICLE_DOCUMENTS,
  VEHICLE_DOCUMENT_LABELS,
  VEHICLE_DOCUMENT_STATUS,
  VEHICLE_FEATURES,
  VEHICLE_FEATURE_LABELS,
  VEHICLE_VALIDATIONS,
  VEHICLE_MESSAGES
} from '../constants/vehiclesConstants';
import toast from 'react-hot-toast';

const VehiclesManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [showFilters, setShowFilters] = useState(false);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  
  const [formData, setFormData] = useState({
    plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    type: VEHICLE_TYPES.VAN,
    capacity: 12,
    fuelType: FUEL_TYPES.DIESEL,
    status: VEHICLE_STATUS.ACTIVE,
    vin: '',
    engineNumber: '',
    mileage: 0,
    features: [],
    owner: {
      type: 'company',
      name: 'Futurismo Tours S.A.',
      contact: ''
    },
    notes: ''
  });

  const [documentFormData, setDocumentFormData] = useState({
    [VEHICLE_DOCUMENTS.SOAT]: { number: '', expiry: '' },
    [VEHICLE_DOCUMENTS.TECHNICAL_REVIEW]: { number: '', expiry: '' },
    [VEHICLE_DOCUMENTS.CIRCULATION_PERMIT]: { number: '', expiry: '' },
    [VEHICLE_DOCUMENTS.INSURANCE]: { number: '', expiry: '', company: '' }
  });

  const [maintenanceFormData, setMaintenanceFormData] = useState({
    type: '',
    km: 0,
    cost: 0,
    provider: '',
    notes: '',
    setInMaintenance: false
  });
  
  const [errors, setErrors] = useState({});

  // Store
  const {
    vehicles,
    loading,
    filters,
    pagination,
    statistics,
    maintenanceRequired,
    fetchVehicles,
    fetchVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    registerMaintenance,
    fetchStatistics,
    fetchMaintenanceRequired,
    setFilters,
    clearFilters,
    setPage,
    setPageSize
  } = useVehiclesStore();

  // Cargar datos al montar
  useEffect(() => {
    fetchVehicles();
    fetchStatistics();
    fetchMaintenanceRequired();
  }, []);

  // Recargar cuando cambien filtros o paginación
  useEffect(() => {
    fetchVehicles();
  }, [filters, pagination.page, pagination.pageSize]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.plate || formData.plate.length < VEHICLE_VALIDATIONS.PLATE_MIN_LENGTH) {
      newErrors.plate = `La placa debe tener entre ${VEHICLE_VALIDATIONS.PLATE_MIN_LENGTH} y ${VEHICLE_VALIDATIONS.PLATE_MAX_LENGTH} caracteres`;
    }

    if (!formData.brand || formData.brand.length < VEHICLE_VALIDATIONS.BRAND_MIN_LENGTH) {
      newErrors.brand = 'La marca es requerida';
    }

    if (!formData.model || formData.model.length < VEHICLE_VALIDATIONS.MODEL_MIN_LENGTH) {
      newErrors.model = 'El modelo es requerido';
    }

    if (formData.year < VEHICLE_VALIDATIONS.MIN_YEAR || formData.year > VEHICLE_VALIDATIONS.MAX_YEAR) {
      newErrors.year = `El año debe estar entre ${VEHICLE_VALIDATIONS.MIN_YEAR} y ${VEHICLE_VALIDATIONS.MAX_YEAR}`;
    }

    if (formData.capacity < VEHICLE_VALIDATIONS.MIN_CAPACITY || formData.capacity > VEHICLE_VALIDATIONS.MAX_CAPACITY) {
      newErrors.capacity = `La capacidad debe estar entre ${VEHICLE_VALIDATIONS.MIN_CAPACITY} y ${VEHICLE_VALIDATIONS.MAX_CAPACITY}`;
    }

    // Validar documentos
    if (!documentFormData[VEHICLE_DOCUMENTS.SOAT].expiry) {
      newErrors.soatExpiry = 'La fecha de vencimiento del SOAT es requerida';
    }

    if (!documentFormData[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW].expiry) {
      newErrors.technicalExpiry = 'La fecha de vencimiento de la revisión técnica es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor corrija los errores en el formulario');
      return;
    }

    try {
      // Preparar datos con documentos
      const vehicleData = {
        ...formData,
        documents: documentFormData
      };

      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, vehicleData);
      } else {
        await createVehicle(vehicleData);
      }

      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      plate: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      type: VEHICLE_TYPES.VAN,
      capacity: 12,
      fuelType: FUEL_TYPES.DIESEL,
      status: VEHICLE_STATUS.ACTIVE,
      vin: '',
      engineNumber: '',
      mileage: 0,
      features: [],
      owner: {
        type: 'company',
        name: 'Futurismo Tours S.A.',
        contact: ''
      },
      notes: ''
    });
    setDocumentFormData({
      [VEHICLE_DOCUMENTS.SOAT]: { number: '', expiry: '' },
      [VEHICLE_DOCUMENTS.TECHNICAL_REVIEW]: { number: '', expiry: '' },
      [VEHICLE_DOCUMENTS.CIRCULATION_PERMIT]: { number: '', expiry: '' },
      [VEHICLE_DOCUMENTS.INSURANCE]: { number: '', expiry: '', company: '' }
    });
    setErrors({});
    setEditingVehicle(null);
  };

  // Manejar edición
  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      type: vehicle.type,
      capacity: vehicle.capacity,
      fuelType: vehicle.fuelType,
      status: vehicle.status,
      vin: vehicle.vin,
      engineNumber: vehicle.engineNumber,
      mileage: vehicle.mileage,
      features: vehicle.features || [],
      owner: vehicle.owner,
      notes: vehicle.notes || ''
    });
    
    // Preparar documentos
    const docs = {};
    Object.keys(VEHICLE_DOCUMENTS).forEach(docType => {
      const docKey = VEHICLE_DOCUMENTS[docType];
      docs[docKey] = vehicle.documents[docKey] || { number: '', expiry: '' };
      if (docs[docKey].expiry) {
        docs[docKey].expiry = docs[docKey].expiry.split('T')[0];
      }
    });
    setDocumentFormData(docs);
    
    setShowForm(true);
  };

  // Manejar eliminación
  const handleDelete = async (vehicle) => {
    if (window.confirm(`¿Está seguro de eliminar el vehículo ${vehicle.plate}?`)) {
      await deleteVehicle(vehicle.id);
    }
  };

  // Ver detalles
  const handleViewDetails = async (vehicle) => {
    await fetchVehicleById(vehicle.id);
    setSelectedVehicle(vehicle);
    setShowDetails(true);
    setActiveTab('info');
  };

  // Manejar registro de mantenimiento
  const handleMaintenanceSubmit = async (e) => {
    e.preventDefault();
    
    if (!maintenanceFormData.type || !maintenanceFormData.provider) {
      toast.error('Complete todos los campos requeridos');
      return;
    }

    try {
      await registerMaintenance(selectedVehicle.id, maintenanceFormData);
      setShowMaintenanceForm(false);
      setMaintenanceFormData({
        type: '',
        km: selectedVehicle.mileage,
        cost: 0,
        provider: '',
        notes: '',
        setInMaintenance: false
      });
      // Recargar detalles
      handleViewDetails(selectedVehicle);
    } catch (error) {
      console.error('Error al registrar mantenimiento:', error);
    }
  };

  // Obtener color del estado del documento
  const getDocumentStatusColor = (status) => {
    switch (status) {
      case VEHICLE_DOCUMENT_STATUS.VALID: return 'green';
      case VEHICLE_DOCUMENT_STATUS.EXPIRING_SOON: return 'yellow';
      case VEHICLE_DOCUMENT_STATUS.EXPIRED: return 'red';
      default: return 'gray';
    }
  };

  // Componente de estadísticas
  const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`bg-${color}-100 rounded-lg p-3`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TruckIcon className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Vehículos</h1>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nuevo Vehículo
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard 
              icon={TruckIcon} 
              label="Total Vehículos" 
              value={statistics.total} 
            />
            <StatCard 
              icon={CheckCircleIcon} 
              label="Activos" 
              value={statistics.byStatus[VEHICLE_STATUS.ACTIVE] || 0}
              color="green"
            />
            <StatCard 
              icon={WrenchScrewdriverIcon} 
              label="Requieren Mantenimiento" 
              value={statistics.maintenanceRequired || 0}
              color="yellow"
            />
            <StatCard 
              icon={UserGroupIcon} 
              label="Capacidad Total" 
              value={statistics.totalCapacity || 0}
              color="purple"
            />
          </div>
        )}

        {/* Alertas de mantenimiento */}
        {maintenanceRequired.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Vehículos que requieren atención
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  {maintenanceRequired.length} vehículo(s) requieren mantenimiento o tienen documentos por vencer
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por placa, marca o modelo..."
                  value={filters.search}
                  onChange={(e) => setFilters({ search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filtros
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Limpiar
            </button>
          </div>

          {/* Filtros expandidos */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ status: e.target.value })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Todos los estados</option>
                {Object.entries(VEHICLE_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <select
                value={filters.type}
                onChange={(e) => setFilters({ type: e.target.value })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Todos los tipos</option>
                {Object.entries(VEHICLE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <select
                value={filters.fuelType}
                onChange={(e) => setFilters({ fuelType: e.target.value })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Todos los combustibles</option>
                {Object.entries(FUEL_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Capacidad mínima"
                value={filters.minCapacity}
                onChange={(e) => setFilters({ minCapacity: e.target.value })}
                className="border rounded-lg px-3 py-2"
              />
            </div>
          )}
        </div>

        {/* Lista de vehículos */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especificaciones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documentos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mantenimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : vehicles.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No se encontraron vehículos
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.plate}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicle.brand} {vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            Año: {vehicle.year}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">
                            {VEHICLE_TYPE_LABELS[vehicle.type]}
                          </div>
                          <div className="text-sm text-gray-500">
                            Capacidad: {vehicle.capacity} personas
                          </div>
                          <div className="text-sm text-gray-500">
                            {FUEL_TYPE_LABELS[vehicle.fuelType]}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {Object.entries(vehicle.documents).map(([type, doc]) => (
                            <div key={type} className="flex items-center">
                              <div className={`h-2 w-2 rounded-full bg-${getDocumentStatusColor(doc.status)}-500 mr-2`}></div>
                              <span className="text-xs text-gray-600">
                                {VEHICLE_DOCUMENT_LABELS[type] || type}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">
                            {vehicle.mileage.toLocaleString()} km
                          </div>
                          <div className="text-sm text-gray-500">
                            Próximo: {vehicle.nextMaintenanceKm.toLocaleString()} km
                          </div>
                          {vehicle.mileage >= vehicle.nextMaintenanceKm && (
                            <span className="text-xs text-yellow-600 font-medium">
                              Requiere mantenimiento
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${VEHICLE_STATUS_COLORS[vehicle.status]}-100 text-${VEHICLE_STATUS_COLORS[vehicle.status]}-800`}>
                          {VEHICLE_STATUS_LABELS[vehicle.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetails(vehicle)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalles"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(vehicle)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(vehicle)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPage(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando{' '}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.pageSize + 1}
                    </span>{' '}
                    a{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)}
                    </span>{' '}
                    de{' '}
                    <span className="font-medium">{pagination.totalItems}</span>{' '}
                    resultados
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={pagination.pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setPage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pagination.page === pageNumber
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal de formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-4xl w-full my-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información Básica */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Información Básica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Placa *
                        </label>
                        <input
                          type="text"
                          value={formData.plate}
                          onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.plate ? 'border-red-500' : ''}`}
                        />
                        {errors.plate && <p className="text-red-500 text-sm mt-1">{errors.plate}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Vehículo *
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => {
                            const type = e.target.value;
                            const capacityRange = VEHICLE_CAPACITY[type];
                            setFormData({ 
                              ...formData, 
                              type,
                              capacity: Math.floor((capacityRange.min + capacityRange.max) / 2)
                            });
                          }}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          {Object.entries(VEHICLE_TYPE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Marca *
                        </label>
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.brand ? 'border-red-500' : ''}`}
                        />
                        {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Modelo *
                        </label>
                        <input
                          type="text"
                          value={formData.model}
                          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.model ? 'border-red-500' : ''}`}
                        />
                        {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Año *
                        </label>
                        <input
                          type="number"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                          min={VEHICLE_VALIDATIONS.MIN_YEAR}
                          max={VEHICLE_VALIDATIONS.MAX_YEAR}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.year ? 'border-red-500' : ''}`}
                        />
                        {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Color
                        </label>
                        <input
                          type="text"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Capacidad (personas) *
                        </label>
                        <input
                          type="number"
                          value={formData.capacity}
                          onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                          min={VEHICLE_VALIDATIONS.MIN_CAPACITY}
                          max={VEHICLE_VALIDATIONS.MAX_CAPACITY}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.capacity ? 'border-red-500' : ''}`}
                        />
                        {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Combustible
                        </label>
                        <select
                          value={formData.fuelType}
                          onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          {Object.entries(FUEL_TYPE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Información Técnica */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Información Técnica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          VIN/Chasis
                        </label>
                        <input
                          type="text"
                          value={formData.vin}
                          onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número de Motor
                        </label>
                        <input
                          type="text"
                          value={formData.engineNumber}
                          onChange={(e) => setFormData({ ...formData, engineNumber: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kilometraje Actual
                        </label>
                        <input
                          type="number"
                          value={formData.mileage}
                          onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
                          min={0}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estado
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          {Object.entries(VEHICLE_STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Documentos */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Documentos</h3>
                    <div className="space-y-4">
                      {/* SOAT */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            SOAT - Número
                          </label>
                          <input
                            type="text"
                            value={documentFormData[VEHICLE_DOCUMENTS.SOAT].number}
                            onChange={(e) => setDocumentFormData({
                              ...documentFormData,
                              [VEHICLE_DOCUMENTS.SOAT]: {
                                ...documentFormData[VEHICLE_DOCUMENTS.SOAT],
                                number: e.target.value
                              }
                            })}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            SOAT - Vencimiento *
                          </label>
                          <input
                            type="date"
                            value={documentFormData[VEHICLE_DOCUMENTS.SOAT].expiry}
                            onChange={(e) => setDocumentFormData({
                              ...documentFormData,
                              [VEHICLE_DOCUMENTS.SOAT]: {
                                ...documentFormData[VEHICLE_DOCUMENTS.SOAT],
                                expiry: e.target.value
                              }
                            })}
                            className={`w-full border rounded-lg px-3 py-2 ${errors.soatExpiry ? 'border-red-500' : ''}`}
                          />
                          {errors.soatExpiry && <p className="text-red-500 text-sm mt-1">{errors.soatExpiry}</p>}
                        </div>
                      </div>

                      {/* Revisión Técnica */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Revisión Técnica - Número
                          </label>
                          <input
                            type="text"
                            value={documentFormData[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW].number}
                            onChange={(e) => setDocumentFormData({
                              ...documentFormData,
                              [VEHICLE_DOCUMENTS.TECHNICAL_REVIEW]: {
                                ...documentFormData[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW],
                                number: e.target.value
                              }
                            })}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Revisión Técnica - Vencimiento *
                          </label>
                          <input
                            type="date"
                            value={documentFormData[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW].expiry}
                            onChange={(e) => setDocumentFormData({
                              ...documentFormData,
                              [VEHICLE_DOCUMENTS.TECHNICAL_REVIEW]: {
                                ...documentFormData[VEHICLE_DOCUMENTS.TECHNICAL_REVIEW],
                                expiry: e.target.value
                              }
                            })}
                            className={`w-full border rounded-lg px-3 py-2 ${errors.technicalExpiry ? 'border-red-500' : ''}`}
                          />
                          {errors.technicalExpiry && <p className="text-red-500 text-sm mt-1">{errors.technicalExpiry}</p>}
                        </div>
                      </div>

                      {/* Permiso de Circulación */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Permiso de Circulación - Número
                          </label>
                          <input
                            type="text"
                            value={documentFormData[VEHICLE_DOCUMENTS.CIRCULATION_PERMIT].number}
                            onChange={(e) => setDocumentFormData({
                              ...documentFormData,
                              [VEHICLE_DOCUMENTS.CIRCULATION_PERMIT]: {
                                ...documentFormData[VEHICLE_DOCUMENTS.CIRCULATION_PERMIT],
                                number: e.target.value
                              }
                            })}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Permiso de Circulación - Vencimiento
                          </label>
                          <input
                            type="date"
                            value={documentFormData[VEHICLE_DOCUMENTS.CIRCULATION_PERMIT].expiry}
                            onChange={(e) => setDocumentFormData({
                              ...documentFormData,
                              [VEHICLE_DOCUMENTS.CIRCULATION_PERMIT]: {
                                ...documentFormData[VEHICLE_DOCUMENTS.CIRCULATION_PERMIT],
                                expiry: e.target.value
                              }
                            })}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                        </div>
                      </div>

                      {/* Seguro */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Seguro - Número
                          </label>
                          <input
                            type="text"
                            value={documentFormData[VEHICLE_DOCUMENTS.INSURANCE].number}
                            onChange={(e) => setDocumentFormData({
                              ...documentFormData,
                              [VEHICLE_DOCUMENTS.INSURANCE]: {
                                ...documentFormData[VEHICLE_DOCUMENTS.INSURANCE],
                                number: e.target.value
                              }
                            })}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Seguro - Compañía
                          </label>
                          <input
                            type="text"
                            value={documentFormData[VEHICLE_DOCUMENTS.INSURANCE].company}
                            onChange={(e) => setDocumentFormData({
                              ...documentFormData,
                              [VEHICLE_DOCUMENTS.INSURANCE]: {
                                ...documentFormData[VEHICLE_DOCUMENTS.INSURANCE],
                                company: e.target.value
                              }
                            })}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Seguro - Vencimiento
                          </label>
                          <input
                            type="date"
                            value={documentFormData[VEHICLE_DOCUMENTS.INSURANCE].expiry}
                            onChange={(e) => setDocumentFormData({
                              ...documentFormData,
                              [VEHICLE_DOCUMENTS.INSURANCE]: {
                                ...documentFormData[VEHICLE_DOCUMENTS.INSURANCE],
                                expiry: e.target.value
                              }
                            })}
                            className="w-full border rounded-lg px-3 py-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Características */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Características</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(VEHICLE_FEATURE_LABELS).map(([value, label]) => (
                        <label key={value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.features.includes(value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, features: [...formData.features, value] });
                              } else {
                                setFormData({ ...formData, features: formData.features.filter(f => f !== value) });
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 mr-2"
                          />
                          <span className="text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Propietario */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Propietario</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo
                        </label>
                        <select
                          value={formData.owner.type}
                          onChange={(e) => setFormData({
                            ...formData,
                            owner: { ...formData.owner, type: e.target.value }
                          })}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          <option value="company">Empresa</option>
                          <option value="leasing">Leasing</option>
                          <option value="rental">Alquiler</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={formData.owner.name}
                          onChange={(e) => setFormData({
                            ...formData,
                            owner: { ...formData.owner, name: e.target.value }
                          })}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contacto
                        </label>
                        <input
                          type="text"
                          value={formData.owner.contact}
                          onChange={(e) => setFormData({
                            ...formData,
                            owner: { ...formData.owner, contact: e.target.value }
                          })}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas / Observaciones
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Guardando...' : (editingVehicle ? 'Actualizar' : 'Crear')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de detalles */}
        {showDetails && selectedVehicle && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Detalles del Vehículo</h2>
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      setSelectedVehicle(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8">
                    {['info', 'documents', 'maintenance', 'assignments', 'photos'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab === 'info' && 'Información'}
                        {tab === 'documents' && 'Documentos'}
                        {tab === 'maintenance' && 'Mantenimiento'}
                        {tab === 'assignments' && 'Asignaciones'}
                        {tab === 'photos' && 'Fotos'}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Contenido del tab */}
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Información General</h3>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Placa</dt>
                            <dd className="text-sm text-gray-900 font-bold">{selectedVehicle.plate}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Marca / Modelo</dt>
                            <dd className="text-sm text-gray-900">{selectedVehicle.brand} {selectedVehicle.model}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Año</dt>
                            <dd className="text-sm text-gray-900">{selectedVehicle.year}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Color</dt>
                            <dd className="text-sm text-gray-900">{selectedVehicle.color}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                            <dd className="text-sm text-gray-900">{VEHICLE_TYPE_LABELS[selectedVehicle.type]}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Capacidad</dt>
                            <dd className="text-sm text-gray-900">{selectedVehicle.capacity} personas</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Combustible</dt>
                            <dd className="text-sm text-gray-900">{FUEL_TYPE_LABELS[selectedVehicle.fuelType]}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Estado</dt>
                            <dd>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${VEHICLE_STATUS_COLORS[selectedVehicle.status]}-100 text-${VEHICLE_STATUS_COLORS[selectedVehicle.status]}-800`}>
                                {VEHICLE_STATUS_LABELS[selectedVehicle.status]}
                              </span>
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Información Técnica</h3>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">VIN/Chasis</dt>
                            <dd className="text-sm text-gray-900">{selectedVehicle.vin}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Número de Motor</dt>
                            <dd className="text-sm text-gray-900">{selectedVehicle.engineNumber}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Kilometraje</dt>
                            <dd className="text-sm text-gray-900">{selectedVehicle.mileage.toLocaleString()} km</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Próximo Mantenimiento</dt>
                            <dd className="text-sm text-gray-900">{selectedVehicle.nextMaintenanceKm.toLocaleString()} km</dd>
                          </div>
                        </dl>

                        <h3 className="text-lg font-medium mt-6 mb-4">Propietario</h3>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Tipo</dt>
                            <dd className="text-sm text-gray-900 capitalize">{selectedVehicle.owner.type}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                            <dd className="text-sm text-gray-900">{selectedVehicle.owner.name}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Contacto</dt>
                            <dd className="text-sm text-gray-900">{selectedVehicle.owner.contact}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {/* Características */}
                    {selectedVehicle.features.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-4">Características</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedVehicle.features.map((feature) => (
                            <span key={feature} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                              {VEHICLE_FEATURE_LABELS[feature]}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Métricas */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">Métricas de Rendimiento</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <ChartBarIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-2xl font-semibold">{selectedVehicle.metrics.totalTrips}</p>
                          <p className="text-sm text-gray-600">Viajes Totales</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <BoltIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-2xl font-semibold">{selectedVehicle.metrics.fuelEfficiency} km/l</p>
                          <p className="text-sm text-gray-600">Eficiencia de Combustible</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <CogIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-2xl font-semibold">S/. {selectedVehicle.metrics.maintenanceCost}</p>
                          <p className="text-sm text-gray-600">Costo Mensual Mantenimiento</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(selectedVehicle.documents).map(([type, doc]) => (
                      <div key={type} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-3 flex items-center">
                          <DocumentTextIcon className="h-5 w-5 mr-2" />
                          {VEHICLE_DOCUMENT_LABELS[type]}
                        </h4>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Número</dt>
                            <dd className="text-sm text-gray-900">{doc.number || 'No registrado'}</dd>
                          </div>
                          {doc.company && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Compañía</dt>
                              <dd className="text-sm text-gray-900">{doc.company}</dd>
                            </div>
                          )}
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Vencimiento</dt>
                            <dd className="text-sm">
                              <span className={`text-${getDocumentStatusColor(doc.status)}-600 font-medium`}>
                                {new Date(doc.expiry).toLocaleDateString()}
                              </span>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Estado</dt>
                            <dd>
                              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-${getDocumentStatusColor(doc.status)}-100 text-${getDocumentStatusColor(doc.status)}-800`}>
                                {doc.status === VEHICLE_DOCUMENT_STATUS.VALID && 'Vigente'}
                                {doc.status === VEHICLE_DOCUMENT_STATUS.EXPIRING_SOON && 'Por vencer'}
                                {doc.status === VEHICLE_DOCUMENT_STATUS.EXPIRED && 'Vencido'}
                              </span>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'maintenance' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Historial de Mantenimiento</h3>
                      <button
                        onClick={() => {
                          setMaintenanceFormData({
                            type: '',
                            km: selectedVehicle.mileage,
                            cost: 0,
                            provider: '',
                            notes: '',
                            setInMaintenance: false
                          });
                          setShowMaintenanceForm(true);
                        }}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 flex items-center"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Registrar Mantenimiento
                      </button>
                    </div>

                    {selectedVehicle.maintenanceHistory.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No hay registros de mantenimiento</p>
                    ) : (
                      selectedVehicle.maintenanceHistory.map((maintenance) => (
                        <div key={maintenance.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{maintenance.type}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(maintenance.date).toLocaleDateString()} - {maintenance.km.toLocaleString()} km
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                Proveedor: {maintenance.provider}
                              </p>
                              {maintenance.notes && (
                                <p className="text-sm text-gray-600 mt-1">{maintenance.notes}</p>
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              S/. {maintenance.cost}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'assignments' && (
                  <div className="space-y-4">
                    {selectedVehicle.currentAssignments.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No hay asignaciones activas</p>
                    ) : (
                      selectedVehicle.currentAssignments.map((assignment) => (
                        <div key={assignment.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{assignment.tourCode}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(assignment.date).toLocaleDateString()} - Chofer: {assignment.driverId}
                              </p>
                              <p className="text-sm text-gray-600">
                                Pasajeros: {assignment.passengers}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500">
                              Asignado: {new Date(assignment.assignedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'photos' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-2">
                        {selectedVehicle.photos.exterior ? (
                          <img src={selectedVehicle.photos.exterior} alt="Exterior" className="h-full w-full object-cover rounded-lg" />
                        ) : (
                          <CameraIcon className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Exterior</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-2">
                        {selectedVehicle.photos.interior ? (
                          <img src={selectedVehicle.photos.interior} alt="Interior" className="h-full w-full object-cover rounded-lg" />
                        ) : (
                          <CameraIcon className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Interior</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center mb-2">
                        {selectedVehicle.photos.documents ? (
                          <img src={selectedVehicle.photos.documents} alt="Documentos" className="h-full w-full object-cover rounded-lg" />
                        ) : (
                          <CameraIcon className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Documentos</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal de registro de mantenimiento */}
        {showMaintenanceForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Registrar Mantenimiento</h3>
                
                <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Mantenimiento *
                    </label>
                    <select
                      value={maintenanceFormData.type}
                      onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, type: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    >
                      <option value="">Seleccione...</option>
                      <option value="Cambio de aceite">Cambio de aceite</option>
                      <option value="Revisión general">Revisión general</option>
                      <option value="Cambio de filtros">Cambio de filtros</option>
                      <option value="Rotación de llantas">Rotación de llantas</option>
                      <option value="Revisión de frenos">Revisión de frenos</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kilometraje
                    </label>
                    <input
                      type="number"
                      value={maintenanceFormData.km}
                      onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, km: parseInt(e.target.value) || 0 })}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Costo (S/.)
                    </label>
                    <input
                      type="number"
                      value={maintenanceFormData.cost}
                      onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, cost: parseFloat(e.target.value) || 0 })}
                      step="0.01"
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proveedor *
                    </label>
                    <input
                      type="text"
                      value={maintenanceFormData.provider}
                      onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, provider: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas
                    </label>
                    <textarea
                      value={maintenanceFormData.notes}
                      onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, notes: e.target.value })}
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={maintenanceFormData.setInMaintenance}
                        onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, setInMaintenance: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 mr-2"
                      />
                      <span className="text-sm text-gray-700">Poner vehículo en mantenimiento</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowMaintenanceForm(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Registrar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclesManagement;