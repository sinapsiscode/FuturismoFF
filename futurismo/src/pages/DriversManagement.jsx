import React, { useState, useEffect } from 'react';
import {
  TruckIcon,
  UserIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  IdentificationIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  CameraIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import useDriversStore from '../stores/driversStore';
import { 
  DRIVER_STATUS,
  DRIVER_STATUS_LABELS,
  DRIVER_STATUS_COLORS,
  LICENSE_CATEGORIES,
  LICENSE_CATEGORY_LABELS,
  EMPLOYMENT_TYPES,
  EMPLOYMENT_TYPE_LABELS,
  WORK_SHIFTS,
  WORK_SHIFT_LABELS,
  DOCUMENT_STATUS,
  DRIVER_VALIDATIONS,
  DRIVER_MESSAGES
} from '../constants/driversConstants';
import toast from 'react-hot-toast';

const DriversManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [showFilters, setShowFilters] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    licenseNumber: '',
    licenseCategory: LICENSE_CATEGORIES.A_IIIC,
    licenseExpiry: '',
    employmentType: EMPLOYMENT_TYPES.FULL_TIME,
    workShift: WORK_SHIFTS.MORNING,
    hireDate: new Date().toISOString().split('T')[0],
    status: DRIVER_STATUS.ACTIVE,
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    notes: ''
  });
  
  const [errors, setErrors] = useState({});

  // Store
  const {
    drivers,
    loading,
    filters,
    pagination,
    statistics,
    fetchDrivers,
    fetchDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
    fetchStatistics,
    setFilters,
    clearFilters,
    setPage,
    setPageSize
  } = useDriversStore();

  // Cargar datos al montar
  useEffect(() => {
    fetchDrivers();
    fetchStatistics();
  }, []);

  // Recargar cuando cambien filtros o paginación
  useEffect(() => {
    fetchDrivers();
  }, [filters, pagination.page, pagination.pageSize]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName || formData.firstName.length < DRIVER_VALIDATIONS.NAME_MIN_LENGTH) {
      newErrors.firstName = `El nombre debe tener al menos ${DRIVER_VALIDATIONS.NAME_MIN_LENGTH} caracteres`;
    }

    if (!formData.lastName || formData.lastName.length < DRIVER_VALIDATIONS.NAME_MIN_LENGTH) {
      newErrors.lastName = `El apellido debe tener al menos ${DRIVER_VALIDATIONS.NAME_MIN_LENGTH} caracteres`;
    }

    if (!formData.dni || formData.dni.length !== DRIVER_VALIDATIONS.DNI_LENGTH) {
      newErrors.dni = 'El DNI debe tener 8 dígitos';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es requerida';
    }

    if (!formData.phone || formData.phone.length < DRIVER_VALIDATIONS.PHONE_MIN_LENGTH) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.licenseNumber || formData.licenseNumber.length !== DRIVER_VALIDATIONS.LICENSE_LENGTH) {
      newErrors.licenseNumber = 'El número de licencia debe tener 9 caracteres';
    }

    if (!formData.licenseExpiry) {
      newErrors.licenseExpiry = 'La fecha de vencimiento de licencia es requerida';
    }

    if (!formData.emergencyContact.name) {
      newErrors.emergencyContactName = 'El nombre del contacto de emergencia es requerido';
    }

    if (!formData.emergencyContact.phone) {
      newErrors.emergencyContactPhone = 'El teléfono del contacto de emergencia es requerido';
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
      if (editingDriver) {
        await updateDriver(editingDriver.id, formData);
      } else {
        await createDriver(formData);
      }

      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error al guardar chofer:', error);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dni: '',
      birthDate: '',
      phone: '',
      email: '',
      address: '',
      licenseNumber: '',
      licenseCategory: LICENSE_CATEGORIES.A_IIIC,
      licenseExpiry: '',
      employmentType: EMPLOYMENT_TYPES.FULL_TIME,
      workShift: WORK_SHIFTS.MORNING,
      hireDate: new Date().toISOString().split('T')[0],
      status: DRIVER_STATUS.ACTIVE,
      emergencyContact: {
        name: '',
        relationship: '',
        phone: ''
      },
      notes: ''
    });
    setErrors({});
    setEditingDriver(null);
  };

  // Manejar edición
  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      firstName: driver.firstName,
      lastName: driver.lastName,
      dni: driver.dni,
      birthDate: driver.birthDate.split('T')[0],
      phone: driver.phone,
      email: driver.email,
      address: driver.address,
      licenseNumber: driver.licenseNumber,
      licenseCategory: driver.licenseCategory,
      licenseExpiry: driver.licenseExpiry.split('T')[0],
      employmentType: driver.employmentType,
      workShift: driver.workShift,
      hireDate: driver.hireDate.split('T')[0],
      status: driver.status,
      emergencyContact: driver.emergencyContact,
      notes: driver.notes || ''
    });
    setShowForm(true);
  };

  // Manejar eliminación
  const handleDelete = async (driver) => {
    if (window.confirm(`¿Está seguro de eliminar al chofer ${driver.fullName}?`)) {
      await deleteDriver(driver.id);
    }
  };

  // Ver detalles
  const handleViewDetails = async (driver) => {
    await fetchDriverById(driver.id);
    setSelectedDriver(driver);
    setShowDetails(true);
    setActiveTab('info');
  };

  // Obtener color del estado del documento
  const getDocumentStatusColor = (status) => {
    switch (status) {
      case DOCUMENT_STATUS.VALID: return 'green';
      case DOCUMENT_STATUS.EXPIRING_SOON: return 'yellow';
      case DOCUMENT_STATUS.EXPIRED: return 'red';
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
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Choferes</h1>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nuevo Chofer
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard 
              icon={UserIcon} 
              label="Total Choferes" 
              value={statistics.total} 
            />
            <StatCard 
              icon={CheckCircleIcon} 
              label="Activos" 
              value={statistics.byStatus[DRIVER_STATUS.ACTIVE] || 0}
              color="green"
            />
            <StatCard 
              icon={ExclamationTriangleIcon} 
              label="Documentos por Vencer" 
              value={statistics.documentsExpiring || 0}
              color="yellow"
            />
            <StatCard 
              icon={StarIcon} 
              label="Rating Promedio" 
              value={statistics.averageRating || 0}
              color="yellow"
            />
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
                  placeholder="Buscar por nombre, DNI o licencia..."
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
                {Object.entries(DRIVER_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <select
                value={filters.licenseCategory}
                onChange={(e) => setFilters({ licenseCategory: e.target.value })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Todas las licencias</option>
                {Object.entries(LICENSE_CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <select
                value={filters.employmentType}
                onChange={(e) => setFilters({ employmentType: e.target.value })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Todos los tipos</option>
                {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <select
                value={filters.workShift}
                onChange={(e) => setFilters({ workShift: e.target.value })}
                className="border rounded-lg px-3 py-2"
              >
                <option value="">Todos los turnos</option>
                {Object.entries(WORK_SHIFT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Lista de choferes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chofer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documentos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Licencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Métricas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : drivers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No se encontraron choferes
                    </td>
                  </tr>
                ) : (
                  drivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {driver.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            DNI: {driver.dni}
                          </div>
                          <div className="text-sm text-gray-500">
                            {driver.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {Object.entries(driver.documents).map(([type, doc]) => (
                            <div key={type} className="flex items-center">
                              <div className={`h-2 w-2 rounded-full bg-${getDocumentStatusColor(doc.status)}-500 mr-2`}></div>
                              <span className="text-xs text-gray-600">
                                {type === 'license' ? 'Licencia' : 
                                 type === 'medicalCertificate' ? 'Médico' : 'Antecedentes'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {driver.licenseCategory}
                          </div>
                          <div className="text-sm text-gray-500">
                            Vence: {new Date(driver.licenseExpiry).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">
                            {EMPLOYMENT_TYPE_LABELS[driver.employmentType]}
                          </div>
                          <div className="text-sm text-gray-500">
                            {WORK_SHIFT_LABELS[driver.workShift]}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${DRIVER_STATUS_COLORS[driver.status]}-100 text-${DRIVER_STATUS_COLORS[driver.status]}-800`}>
                          {DRIVER_STATUS_LABELS[driver.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                            <span>{driver.metrics.averageRating}</span>
                          </div>
                          <div className="text-gray-500">
                            {driver.metrics.totalTrips} viajes
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetails(driver)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalles"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(driver)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(driver)}
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
                    {[...Array(pagination.totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setPage(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.page === index + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingDriver ? 'Editar Chofer' : 'Nuevo Chofer'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información Personal */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Información Personal</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.firstName ? 'border-red-500' : ''}`}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Apellido *
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.lastName ? 'border-red-500' : ''}`}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          DNI *
                        </label>
                        <input
                          type="text"
                          value={formData.dni}
                          onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                          maxLength={8}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.dni ? 'border-red-500' : ''}`}
                        />
                        {errors.dni && <p className="text-red-500 text-sm mt-1">{errors.dni}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de Nacimiento *
                        </label>
                        <input
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.birthDate ? 'border-red-500' : ''}`}
                        />
                        {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.phone ? 'border-red-500' : ''}`}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dirección
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información de Licencia */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Información de Licencia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número de Licencia *
                        </label>
                        <input
                          type="text"
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                          maxLength={9}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.licenseNumber ? 'border-red-500' : ''}`}
                        />
                        {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoría de Licencia *
                        </label>
                        <select
                          value={formData.licenseCategory}
                          onChange={(e) => setFormData({ ...formData, licenseCategory: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          {Object.entries(LICENSE_CATEGORY_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de Vencimiento *
                        </label>
                        <input
                          type="date"
                          value={formData.licenseExpiry}
                          onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.licenseExpiry ? 'border-red-500' : ''}`}
                        />
                        {errors.licenseExpiry && <p className="text-red-500 text-sm mt-1">{errors.licenseExpiry}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Información Laboral */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Información Laboral</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Empleo
                        </label>
                        <select
                          value={formData.employmentType}
                          onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Turno de Trabajo
                        </label>
                        <select
                          value={formData.workShift}
                          onChange={(e) => setFormData({ ...formData, workShift: e.target.value })}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          {Object.entries(WORK_SHIFT_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de Contratación
                        </label>
                        <input
                          type="date"
                          value={formData.hireDate}
                          onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
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
                          {Object.entries(DRIVER_STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contacto de Emergencia */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Contacto de Emergencia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          value={formData.emergencyContact.name}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                          })}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.emergencyContactName ? 'border-red-500' : ''}`}
                        />
                        {errors.emergencyContactName && <p className="text-red-500 text-sm mt-1">{errors.emergencyContactName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Relación
                        </label>
                        <input
                          type="text"
                          value={formData.emergencyContact.relationship}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
                          })}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          value={formData.emergencyContact.phone}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                          })}
                          className={`w-full border rounded-lg px-3 py-2 ${errors.emergencyContactPhone ? 'border-red-500' : ''}`}
                        />
                        {errors.emergencyContactPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyContactPhone}</p>}
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
                      {loading ? 'Guardando...' : (editingDriver ? 'Actualizar' : 'Crear')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de detalles */}
        {showDetails && selectedDriver && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Detalles del Chofer</h2>
                  <button
                    onClick={() => {
                      setShowDetails(false);
                      setSelectedDriver(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8">
                    {['info', 'documents', 'assignments', 'metrics'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab === 'info' && 'Información General'}
                        {tab === 'documents' && 'Documentos'}
                        {tab === 'assignments' && 'Asignaciones'}
                        {tab === 'metrics' && 'Métricas'}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Contenido del tab */}
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Información Personal</h3>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Nombre Completo</dt>
                            <dd className="text-sm text-gray-900">{selectedDriver.fullName}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">DNI</dt>
                            <dd className="text-sm text-gray-900">{selectedDriver.dni}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Fecha de Nacimiento</dt>
                            <dd className="text-sm text-gray-900">
                              {new Date(selectedDriver.birthDate).toLocaleDateString()} ({selectedDriver.age} años)
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                            <dd className="text-sm text-gray-900">{selectedDriver.phone}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="text-sm text-gray-900">{selectedDriver.email}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Dirección</dt>
                            <dd className="text-sm text-gray-900">{selectedDriver.address}</dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Información Laboral</h3>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Tipo de Empleo</dt>
                            <dd className="text-sm text-gray-900">
                              {EMPLOYMENT_TYPE_LABELS[selectedDriver.employmentType]}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Turno</dt>
                            <dd className="text-sm text-gray-900">
                              {WORK_SHIFT_LABELS[selectedDriver.workShift]}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Fecha de Ingreso</dt>
                            <dd className="text-sm text-gray-900">
                              {new Date(selectedDriver.hireDate).toLocaleDateString()} ({selectedDriver.yearsOfService} años)
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Estado</dt>
                            <dd>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${DRIVER_STATUS_COLORS[selectedDriver.status]}-100 text-${DRIVER_STATUS_COLORS[selectedDriver.status]}-800`}>
                                {DRIVER_STATUS_LABELS[selectedDriver.status]}
                              </span>
                            </dd>
                          </div>
                        </dl>

                        <h3 className="text-lg font-medium mt-6 mb-4">Contacto de Emergencia</h3>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Nombre</dt>
                            <dd className="text-sm text-gray-900">{selectedDriver.emergencyContact.name}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Relación</dt>
                            <dd className="text-sm text-gray-900">{selectedDriver.emergencyContact.relationship}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                            <dd className="text-sm text-gray-900">{selectedDriver.emergencyContact.phone}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Licencia */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-3 flex items-center">
                          <IdentificationIcon className="h-5 w-5 mr-2" />
                          Licencia de Conducir
                        </h4>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Número</dt>
                            <dd className="text-sm text-gray-900">{selectedDriver.licenseNumber}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Categoría</dt>
                            <dd className="text-sm text-gray-900">
                              {LICENSE_CATEGORY_LABELS[selectedDriver.licenseCategory]}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Vencimiento</dt>
                            <dd className="text-sm">
                              <span className={`text-${getDocumentStatusColor(selectedDriver.documents.license.status)}-600`}>
                                {new Date(selectedDriver.documents.license.expiry).toLocaleDateString()}
                              </span>
                            </dd>
                          </div>
                        </dl>
                      </div>

                      {/* Certificado Médico */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-3 flex items-center">
                          <DocumentTextIcon className="h-5 w-5 mr-2" />
                          Certificado Médico
                        </h4>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Vencimiento</dt>
                            <dd className="text-sm">
                              <span className={`text-${getDocumentStatusColor(selectedDriver.documents.medicalCertificate.status)}-600`}>
                                {new Date(selectedDriver.documents.medicalCertificate.expiry).toLocaleDateString()}
                              </span>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Estado</dt>
                            <dd className="text-sm text-gray-900">
                              {selectedDriver.documents.medicalCertificate.status === DOCUMENT_STATUS.VALID && 'Vigente'}
                              {selectedDriver.documents.medicalCertificate.status === DOCUMENT_STATUS.EXPIRING_SOON && 'Por vencer'}
                              {selectedDriver.documents.medicalCertificate.status === DOCUMENT_STATUS.EXPIRED && 'Vencido'}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      {/* Antecedentes */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium mb-3 flex items-center">
                          <DocumentTextIcon className="h-5 w-5 mr-2" />
                          Antecedentes Policiales
                        </h4>
                        <dl className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Vencimiento</dt>
                            <dd className="text-sm">
                              <span className={`text-${getDocumentStatusColor(selectedDriver.documents.backgroundCheck.status)}-600`}>
                                {new Date(selectedDriver.documents.backgroundCheck.expiry).toLocaleDateString()}
                              </span>
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Estado</dt>
                            <dd className="text-sm text-gray-900">
                              {selectedDriver.documents.backgroundCheck.status === DOCUMENT_STATUS.VALID && 'Vigente'}
                              {selectedDriver.documents.backgroundCheck.status === DOCUMENT_STATUS.EXPIRING_SOON && 'Por vencer'}
                              {selectedDriver.documents.backgroundCheck.status === DOCUMENT_STATUS.EXPIRED && 'Vencido'}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'assignments' && (
                  <div className="space-y-4">
                    {selectedDriver.currentAssignments.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No hay asignaciones activas</p>
                    ) : (
                      selectedDriver.currentAssignments.map((assignment) => (
                        <div key={assignment.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{assignment.tourCode}</h4>
                              <p className="text-sm text-gray-500">
                                {new Date(assignment.date).toLocaleDateString()} - {assignment.vehicleId}
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

                {activeTab === 'metrics' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <ChartBarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-semibold text-blue-900">
                        {selectedDriver.metrics.totalTrips}
                      </p>
                      <p className="text-sm text-blue-700">Viajes Totales</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <TruckIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-semibold text-green-900">
                        {selectedDriver.metrics.accidentFreeKm.toLocaleString()} km
                      </p>
                      <p className="text-sm text-green-700">Sin Accidentes</p>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <StarIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-2xl font-semibold text-yellow-900">
                        {selectedDriver.metrics.averageRating}
                      </p>
                      <p className="text-sm text-yellow-700">Rating Promedio</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <ClockIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-semibold text-purple-900">
                        {selectedDriver.metrics.punctualityRate}%
                      </p>
                      <p className="text-sm text-purple-700">Puntualidad</p>
                    </div>

                    <div className="bg-indigo-50 rounded-lg p-4 text-center">
                      <CalendarIcon className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                      <p className="text-2xl font-semibold text-indigo-900">
                        {selectedDriver.metrics.hoursThisWeek}h
                      </p>
                      <p className="text-sm text-indigo-700">Horas Esta Semana</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <CalendarIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-2xl font-semibold text-gray-900">
                        {selectedDriver.metrics.hoursThisMonth}h
                      </p>
                      <p className="text-sm text-gray-700">Horas Este Mes</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriversManagement;