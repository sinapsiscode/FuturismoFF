import { useState, useEffect } from 'react';
import { useGuidesStore } from '../stores/guidesStore';

const useGuideAvailability = (guideId, onAvailabilityChange) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { getGuideAgenda, updateGuideAgenda } = useGuidesStore();

  useEffect(() => {
    loadAvailability();
  }, [guideId, selectedDate]);

  const loadAvailability = () => {
    setIsLoading(true);
    const agenda = getGuideAgenda(guideId, selectedDate);
    setAvailability(agenda);
    setIsLoading(false);
  };

  const updateAvailability = (newAvailability) => {
    setAvailability(newAvailability);
    updateGuideAgenda(guideId, selectedDate, newAvailability);
    if (onAvailabilityChange) {
      onAvailabilityChange(selectedDate, newAvailability);
    }
  };

  const addTimeSlot = (timeSlot) => {
    if (timeSlot && /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(timeSlot)) {
      const updatedAvailability = {
        ...availability,
        disponible: true,
        horarios: [...(availability?.horarios || []), timeSlot]
      };
      updateAvailability(updatedAvailability);
      return true;
    }
    return false;
  };

  const removeTimeSlot = (index) => {
    const updatedAvailability = {
      ...availability,
      horarios: availability.horarios.filter((_, i) => i !== index)
    };
    if (updatedAvailability.horarios.length === 0) {
      updatedAvailability.disponible = false;
    }
    updateAvailability(updatedAvailability);
  };

  const toggleAvailability = () => {
    const updatedAvailability = {
      disponible: !availability?.disponible,
      horarios: availability?.disponible ? [] : ['09:00-17:00']
    };
    updateAvailability(updatedAvailability);
  };

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return {
    selectedDate,
    setSelectedDate,
    availability,
    isLoading,
    addTimeSlot,
    removeTimeSlot,
    toggleAvailability,
    changeDate
  };
};

export const useFreelanceAvailability = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [freelanceGuides, setFreelanceGuides] = useState([]);
  
  const { getGuides, getGuideAgenda } = useGuidesStore();

  useEffect(() => {
    const guides = getGuides({ tipo: 'freelance' });
    setFreelanceGuides(guides);
  }, [getGuides]);

  const changeDate = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const getGuideAvailabilityInfo = (guide) => {
    const agenda = getGuideAgenda(guide.id, selectedDate);
    
    // Create specialties safely
    const languages = guide.specializations?.languages?.map(lang => lang.code.toUpperCase()) || [];
    const museums = guide.specializations?.museums?.map(museum => museum.name) || [];
    const specialties = [...languages, ...museums.slice(0, 2)]; // Limit to 2 museums
    
    // Check availability
    const availableSlots = agenda?.slots?.filter(slot => slot.status === 'available') || [];
    const isAvailable = availableSlots.length > 0;
    const busySlots = agenda?.slots?.filter(slot => slot.status === 'busy') || [];
    
    return {
      agenda,
      specialties,
      availableSlots,
      isAvailable,
      busySlots
    };
  };

  return {
    selectedDate,
    setSelectedDate,
    freelanceGuides,
    changeDate,
    getGuideAvailabilityInfo
  };
};

export default useGuideAvailability;