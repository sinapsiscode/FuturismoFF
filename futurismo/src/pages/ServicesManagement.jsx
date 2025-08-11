import React, { useState } from 'react';
import { 
  PlusIcon, 
  Cog6ToothIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import ServicesListSimple from '../components/services/ServicesListSimple';
import ServiceForm from '../components/services/ServiceForm';
import { useServicesStore } from '../stores/servicesStore';

const ServicesManagement = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { deleteService, updateServiceStatus } = useServicesStore();

  const handleCreateService = () => {
    setSelectedService(null);
    setCurrentView('create');
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setCurrentView('edit');
  };

  const handleViewService = (service) => {
    setSelectedService(service);
    setCurrentView('view');
  };

  const handleDeleteService = (service) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el servicio "${service.code}"?`)) {
      deleteService(service.id);
    }
  };

  const handleFormSubmit = async (serviceData) => {
    setIsLoading(true);
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentView('list');
      setSelectedService(null);
    } catch (error) {
      console.error('Error al guardar servicio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormCancel = () => {
    setCurrentView('list');
    setSelectedService(null);
  };

  const renderHeader = () => {
    const titles = {
      list: 'Gestión de Servicios',
      create: 'Nuevo Servicio',
      edit: 'Editar Servicio',
      view: 'Detalles del Servicio'
    };

    return (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {currentView !== 'list' && (
            <button
              onClick={() => setCurrentView('list')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {titles[currentView]}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {currentView === 'list' && 'Registra y gestiona todos los servicios turísticos'}
              {currentView === 'create' && 'Registra una nueva solicitud de servicio'}
              {currentView === 'edit' && `Editando: ${selectedService?.code}`}
              {currentView === 'view' && `Código: ${selectedService?.code}`}
            </p>
          </div>
        </div>

        {currentView === 'list' && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCreateService}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Nuevo Servicio
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderServiceStats = () => {
    if (currentView !== 'list') return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Servicios</p>
              <p className="text-2xl font-semibold text-gray-900">--</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">--</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Cog6ToothIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Curso</p>
              <p className="text-2xl font-semibold text-gray-900">--</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <InformationCircleIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completados</p>
              <p className="text-2xl font-semibold text-gray-900">--</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'list':
        return (
          <ServicesListSimple
            onEdit={handleEditService}
            onDelete={handleDeleteService}
            onView={handleViewService}
            onCreate={handleCreateService}
          />
        );

      case 'create':
        return (
          <ServiceForm
            service={null}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isLoading}
          />
        );

      case 'edit':
        return (
          <ServiceForm
            service={selectedService}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isLoading}
          />
        );

      case 'view':
        return (
          <ServiceDetails 
            service={selectedService}
            onEdit={() => handleEditService(selectedService)}
            onDelete={() => handleDeleteService(selectedService)}
            onStatusChange={(status) => updateServiceStatus(selectedService.id, status)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderHeader()}
      {renderServiceStats()}
      {renderContent()}
    </div>
  );
};

// Componente para mostrar detalles del servicio
const ServiceDetails = ({ service, onEdit, onDelete, onStatusChange }) => {
  if (!service) return null;

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      on_way: 'bg-yellow-100 text-yellow-800',
      in_service: 'bg-green-100 text-green-800',
      finished: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Información Principal */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{service.code}</h3>
            <p className="text-sm text-gray-600">{service.type}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
              {service.status}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={onEdit}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
              >
                Editar
              </button>
              <button
                onClick={onDelete}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cliente */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Cliente</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{service.client?.name || 'N/A'}</p>
              <p>{service.client?.phone || 'N/A'}</p>
              <p>{service.client?.email || 'N/A'}</p>
            </div>
          </div>

          {/* Servicio */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Servicio</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Destino:</strong> {service.destination}</p>
              <p><strong>Fecha:</strong> {formatDate(service.date)}</p>
              <p><strong>Hora:</strong> {service.startTime} - {service.endTime}</p>
              <p><strong>Participantes:</strong> {service.participants}</p>
            </div>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recursos Asignados</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Guía:</strong> {service.guide?.name || 'Sin asignar'}</p>
              <p><strong>Chofer:</strong> {service.driver?.name || 'Sin asignar'}</p>
              <p><strong>Vehículo:</strong> {service.vehicle?.plate || 'Sin asignar'}</p>
            </div>
          </div>
        </div>

        {service.notes && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium text-gray-900 mb-2">Notas</h4>
            <p className="text-sm text-gray-600">{service.notes}</p>
          </div>
        )}
      </div>

      {/* Acciones de Estado */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="font-medium text-gray-900 mb-4">Cambiar Estado</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onStatusChange('pending')}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
          >
            Pendiente
          </button>
          <button
            onClick={() => onStatusChange('on_way')}
            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
          >
            En Camino
          </button>
          <button
            onClick={() => onStatusChange('in_service')}
            className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
          >
            En Servicio
          </button>
          <button
            onClick={() => onStatusChange('finished')}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
          >
            Finalizado
          </button>
          <button
            onClick={() => onStatusChange('cancelled')}
            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
          >
            Cancelado
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesManagement;