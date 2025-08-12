import React, { useEffect } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useServicesStore } from '../../stores/servicesStore';

const ServicesListSimple = ({ 
  onEdit, 
  onDelete, 
  onView,
  onCreate
}) => {
  const {
    services,
    isLoading,
    error,
    loadServices
  } = useServicesStore();

  useEffect(() => {
    loadServices();
  }, []);

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: 'Pendiente', className: 'bg-gray-100 text-gray-800' },
      on_way: { label: 'En Camino', className: 'bg-yellow-100 text-yellow-800' },
      in_service: { label: 'En Servicio', className: 'bg-green-100 text-green-800' },
      finished: { label: 'Finalizado', className: 'bg-blue-100 text-blue-800' },
      cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-800' }
    };

    const statusConfig = config[status] || config.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
        {statusConfig.label}
      </span>
    );
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-red-800">Error</h3>
        <p className="mt-2 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Lista de Servicios</h2>
          <p className="mt-1 text-sm text-gray-600">
            {services.length} servicios registrados
          </p>
        </div>
        {onCreate && (
          <button
            onClick={onCreate}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Nuevo Servicio
          </button>
        )}
      </div>

      {/* Lista */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando servicios...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay servicios registrados
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza creando tu primer servicio turístico.
            </p>
            {onCreate && (
              <button
                onClick={onCreate}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Crear Primer Servicio
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título del Servicio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destino
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duración
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Base
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {service.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {service.title || 'Sin título'}
                      </div>
                      {service.type && (
                        <div className="text-xs text-gray-500 capitalize">
                          {service.type.replace('_', ' ')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {service.destination}
                      </div>
                      {(service.languages || service.language) && (
                        <div className="text-xs text-gray-500">
                          {service.languages ? (
                            service.languages.map(lang => {
                              const langMap = {
                                'es': '🇪🇸',
                                'en': '🇺🇸',
                                'pt': '🇵🇹',
                                'fr': '🇫🇷',
                                'de': '🇩🇪',
                                'it': '🇮🇹',
                                'nl': '🇳🇱'
                              };
                              return langMap[lang] || lang.toUpperCase();
                            }).join(' ')
                          ) : (
                            // Compatibilidad con campo antiguo
                            service.language === 'es' ? '🇪🇸 Español' : 
                            service.language === 'en' ? '🇺🇸 English' : 
                            service.language.toUpperCase()
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {service.duration || '--'} hrs
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {service.maxParticipants || '--'} pax
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        S/. {service.basePrice?.toFixed(2) || service.price?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-xs text-gray-500">
                        por persona
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {onView && (
                          <button
                            onClick={() => onView(service)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Ver detalles"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(service)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                            title="Editar"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(service)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Eliminar"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesListSimple;