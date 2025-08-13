import { useState, useEffect } from 'react';
import { MapIcon, UserGroupIcon, ChartBarIcon, FunnelIcon, CameraIcon, PlayIcon, PauseIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import LiveMapResponsive from '../components/monitoring/LiveMapResponsive';
import TourProgress from '../components/monitoring/TourProgress';
import TourPhotosGallery from '../components/monitoring/TourPhotosGallery';
import useAuthStore from '../stores/authStore';
import useGuideTours from '../hooks/useGuideTours';
import toast from 'react-hot-toast';

const Monitoring = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  
  // Para guías, solo mostrar sus propios tours
  const isGuide = user?.role === 'guide';
  const isAdmin = user?.role === 'admin';
  
  const [activeView, setActiveView] = useState(isGuide ? 'tours' : 'map');
  const [selectedTour, setSelectedTour] = useState(null);

  // Hook para manejar tours del guía (reemplaza datos hardcodeados)
  const {
    tours: guideTours,
    loading: toursLoading,
    activeTour,
    updateTourStatus,
    getStats
  } = useGuideTours();

  // Obtener estadísticas del guía
  const guideStats = getStats();

  // Solo para guías: manejar tours
  const handleStartTour = async (tourId) => {
    try {
      await updateTourStatus(tourId, 'iniciado');
      toast.success('Tour iniciado correctamente');
    } catch (error) {
      toast.error('Error al iniciar el tour');
    }
  };

  const handlePauseTour = async (tourId) => {
    try {
      await updateTourStatus(tourId, 'pausado');
      toast.success('Tour pausado');
    } catch (error) {
      toast.error('Error al pausar el tour');
    }
  };

  const handleCompleteTour = async (tourId) => {
    try {
      await updateTourStatus(tourId, 'completado');
      toast.success('Tour completado exitosamente');
    } catch (error) {
      toast.error('Error al completar el tour');
    }
  };

  // Configuración de vistas según el rol
  const viewConfig = isGuide 
    ? [
        { key: 'tours', label: t('monitoring.views.myTours'), icon: UserGroupIcon },
        { key: 'stats', label: t('monitoring.views.statistics'), icon: ChartBarIcon },
      ]
    : [
        { key: 'map', label: t('monitoring.views.liveMap'), icon: MapIcon },
        { key: 'tours', label: t('monitoring.views.activeTours'), icon: UserGroupIcon },
        { key: 'stats', label: t('monitoring.views.statistics'), icon: ChartBarIcon },
        { key: 'photos', label: t('monitoring.views.photos'), icon: CameraIcon },
      ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isGuide ? t('monitoring.myToursTitle') : t('monitoring.title')}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {isGuide 
              ? t('monitoring.guideDescription') 
              : t('monitoring.description')
            }
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {viewConfig.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.key}
                onClick={() => setActiveView(view.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeView === view.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5" />
                  <span>{view.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow">
        {/* Vista de Mapa - Solo para Admin */}
        {activeView === 'map' && isAdmin && (
          <div className="p-6">
            <LiveMapResponsive />
          </div>
        )}

        {/* Vista de Tours */}
        {activeView === 'tours' && (
          <div className="p-6">
            {isGuide ? (
              /* Vista de guía - Sus propios tours */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {t('monitoring.myTours')}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {toursLoading ? t('common.loading') : `${guideTours.length} ${t('monitoring.toursTotal')}`}
                  </div>
                </div>

                {toursLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : guideTours.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>{t('monitoring.noToursAssigned')}</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {guideTours.map((tour) => (
                      <div key={tour.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{tour.name}</h4>
                            <p className="text-sm text-gray-500">{tour.agency}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            tour.status === 'completado'
                              ? 'bg-green-100 text-green-800'
                              : tour.status === 'iniciado'
                              ? 'bg-blue-100 text-blue-800'
                              : tour.status === 'pausado'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {t(`monitoring.status.${tour.status}`)}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>{t('monitoring.date')}:</span>
                            <span>{tour.date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('monitoring.time')}:</span>
                            <span>{tour.time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('monitoring.tourists')}:</span>
                            <span>{tour.tourists}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t('monitoring.location')}:</span>
                            <span className="truncate">{tour.location}</span>
                          </div>
                        </div>

                        {/* Controles del tour */}
                        <div className="flex gap-2 mt-4">
                          {tour.status === 'asignado' && (
                            <button
                              onClick={() => handleStartTour(tour.id)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              <PlayIcon className="w-4 h-4" />
                              {t('monitoring.actions.start')}
                            </button>
                          )}
                          
                          {tour.status === 'iniciado' && (
                            <>
                              <button
                                onClick={() => handlePauseTour(tour.id)}
                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                              >
                                <PauseIcon className="w-4 h-4" />
                                {t('monitoring.actions.pause')}
                              </button>
                              <button
                                onClick={() => handleCompleteTour(tour.id)}
                                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                              >
                                <CheckIcon className="w-4 h-4" />
                                {t('monitoring.actions.complete')}
                              </button>
                            </>
                          )}
                          
                          {tour.status === 'pausado' && (
                            <button
                              onClick={() => handleStartTour(tour.id)}
                              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              <PlayIcon className="w-4 h-4" />
                              {t('monitoring.actions.resume')}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Vista de admin - Todos los tours activos */
              <TourProgress />
            )}
          </div>
        )}

        {/* Vista de Estadísticas */}
        {activeView === 'stats' && (
          <div className="p-6">
            {isGuide ? (
              /* Estadísticas del guía */
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('monitoring.personalStats')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <UserGroupIcon className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-blue-600">
                          {t('monitoring.stats.activeTours')}
                        </div>
                        <div className="text-2xl font-bold text-blue-900">
                          {guideStats.activeTours}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <CheckIcon className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-green-600">
                          {t('monitoring.stats.completedToday')}
                        </div>
                        <div className="text-2xl font-bold text-green-900">
                          {guideStats.completedToday}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ChartBarIcon className="w-8 h-8 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-yellow-600">
                          {t('monitoring.stats.weeklyHours')}
                        </div>
                        <div className="text-2xl font-bold text-yellow-900">
                          {guideStats.weeklyHours}h
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">⭐</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-purple-600">
                          {t('monitoring.stats.rating')}
                        </div>
                        <div className="text-2xl font-bold text-purple-900">
                          {guideStats.rating}/5
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Estadísticas generales para admin */
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t('monitoring.generalStats')}
                </h3>
                {/* Aquí iría el componente de estadísticas generales */}
                <p className="text-gray-500">{t('monitoring.statsComingSoon')}</p>
              </div>
            )}
          </div>
        )}

        {/* Vista de Fotos - Solo para Admin */}
        {activeView === 'photos' && isAdmin && (
          <TourPhotosGallery />
        )}
      </div>
    </div>
  );
};

export default Monitoring;