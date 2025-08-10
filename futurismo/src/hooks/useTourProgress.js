import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { TOUR_STATUS } from '../constants/monitoringConstants';
import { getMockTourData } from '../data/mockMonitoringData';

const useTourProgress = (tourId, isGuideView = false) => {
  const [expandedStop, setExpandedStop] = useState(null);
  const [tourData, setTourData] = useState(null);
  const { t } = useTranslation();

  const mockTourData = getMockTourData(tourId);
  
  // Traducir los textos del mock data
  const mockTour = {
    ...mockTourData,
    name: t(mockTourData.name),
    guide: {
      ...mockTourData.guide,
      name: t(mockTourData.guide.name),
      phone: t(mockTourData.guide.phone)
    },
    stops: mockTourData.stops.map(stop => ({
      ...stop,
      name: t(stop.name),
      description: t(stop.description),
      incidents: stop.incidents.map(incident => ({
        ...incident,
        message: t(incident.message)
      }))
    })),
    incidents: mockTourData.incidents.map(incident => ({
      ...incident,
      message: t(incident.message)
    }))
  };

  const getProgressPercentage = () => {
    const completedStops = mockTour.stops.filter(s => s.status === TOUR_STATUS.COMPLETED).length;
    return (completedStops / mockTour.stops.length) * 100;
  };

  const getEstimatedDelay = () => {
    const now = new Date();
    const elapsed = now - mockTour.actualStartTime;
    const plannedElapsed = now - mockTour.startTime;
    const delay = elapsed - plannedElapsed;
    return delay > 0 ? delay / 60000 : 0;
  };

  const handlePhotosChange = (stopId, newPhotos) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Photos updated for stop:', stopId, newPhotos);
    }
    toast.success(t('monitoring.tour.photosUpdated'));
  };

  const canUploadPhotos = (stop) => {
    return isGuideView && (
      stop.status === TOUR_STATUS.IN_PROGRESS || 
      stop.status === TOUR_STATUS.COMPLETED
    );
  };

  const toggleStop = (stopId) => {
    setExpandedStop(expandedStop === stopId ? null : stopId);
  };

  return {
    tour: mockTour,
    expandedStop,
    progressPercentage: getProgressPercentage(),
    estimatedDelay: getEstimatedDelay(),
    handlePhotosChange,
    canUploadPhotos,
    toggleStop
  };
};

export default useTourProgress;