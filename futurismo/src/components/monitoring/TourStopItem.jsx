import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircleIcon, 
  MapPinIcon, 
  ClockIcon, 
  ChevronRightIcon, 
  ExclamationTriangleIcon,
  CameraIcon,
  EllipsisHorizontalCircleIcon
} from '@heroicons/react/24/outline';
import { formatters } from '../../utils/formatters';
import PhotoUpload from '../common/PhotoUpload';
import { TOUR_STATUS, MAX_PHOTOS_PER_STOP } from '../../constants/monitoringConstants';

const TourStopItem = ({ 
  stop, 
  index, 
  totalStops,
  isExpanded, 
  onToggle, 
  canUploadPhotos,
  onPhotosChange 
}) => {
  const { t } = useTranslation();

  const getStopIcon = (status) => {
    switch (status) {
      case TOUR_STATUS.COMPLETED:
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
      case TOUR_STATUS.IN_PROGRESS:
        return <EllipsisHorizontalCircleIcon className="w-6 h-6 text-blue-600 animate-pulse" />;
      case TOUR_STATUS.PENDING:
        return <EllipsisHorizontalCircleIcon className="w-6 h-6 text-gray-400" />;
      default:
        return <EllipsisHorizontalCircleIcon className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div>
      <div
        className={`flex items-start gap-4 cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-colors ${
          isExpanded ? 'bg-gray-50' : ''
        }`}
        onClick={onToggle}
      >
        <div className="relative">
          {getStopIcon(stop.status)}
          {index < totalStops - 1 && (
            <div className={`absolute top-8 left-3 w-0.5 h-16 ${
              stop.status === TOUR_STATUS.COMPLETED ? 'bg-green-300' : 'bg-gray-300'
            }`} />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h5 className="font-semibold">{stop.name}</h5>
              <p className="text-sm text-gray-600 mt-1">{stop.description}</p>
              
              <div className="flex items-center gap-4 mt-2 text-sm">
                {stop.arrivalTime && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{t('monitoring.tour.arrival')}: {formatters.formatTime(stop.arrivalTime)}</span>
                  </div>
                )}
                {stop.actualTime && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <ClockIcon className="w-4 h-4" />
                    <span>{stop.actualTime} {t('monitoring.tour.minutes')}</span>
                  </div>
                )}
              </div>

              {stop.incidents.length > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                  <ExclamationTriangleIcon className="w-4 h-4 inline mr-1" />
                  {stop.incidents[0].message}
                </div>
              )}
            </div>

            <ChevronRightIcon className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`} />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="ml-10 pl-4 pb-4 border-l-2 border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">{t('monitoring.tour.estimatedTime')}</p>
                <p className="font-medium">{stop.estimatedTime} {t('monitoring.tour.minutes')}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('monitoring.tour.actualTime')}</p>
                <p className="font-medium">{stop.actualTime || '-'} {t('monitoring.tour.minutes')}</p>
              </div>
              {stop.departureTime && (
                <>
                  <div>
                    <p className="text-gray-600">{t('monitoring.tour.arrivalTime')}</p>
                    <p className="font-medium">{formatters.formatTime(stop.arrivalTime)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('monitoring.tour.departureTime')}</p>
                    <p className="font-medium">{formatters.formatTime(stop.departureTime)}</p>
                  </div>
                </>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700">
                  {t('monitoring.tour.stopPhotos')} {canUploadPhotos(stop) && t('monitoring.tour.optional')}
                </p>
                {stop.photos.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {stop.photos.length} {t('monitoring.tour.photo', { count: stop.photos.length })}
                  </span>
                )}
              </div>

              {canUploadPhotos(stop) ? (
                <PhotoUpload
                  photos={stop.photos}
                  onPhotosChange={(newPhotos) => onPhotosChange(stop.id, newPhotos)}
                  maxPhotos={MAX_PHOTOS_PER_STOP}
                />
              ) : (
                <>
                  {stop.photos.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {stop.photos.map((photo) => (
                        <div key={photo.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      <CameraIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">{t('monitoring.tour.noPhotos')}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {stop.status === TOUR_STATUS.PENDING && (
              <div className="text-sm text-gray-500">
                <p>{t('monitoring.tour.notVisitedYet')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

TourStopItem.propTypes = {
  stop: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  totalStops: PropTypes.number.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  canUploadPhotos: PropTypes.func.isRequired,
  onPhotosChange: PropTypes.func.isRequired
};

export default TourStopItem;