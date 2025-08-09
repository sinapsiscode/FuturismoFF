import { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays 
} from 'date-fns';
import useIndependentAgendaStore from '../stores/independentAgendaStore';
import useAuthStore from '../stores/authStore';

const useMonthView = () => {
  const { user } = useAuthStore();
  const { 
    selectedDate, 
    currentGuide,
    actions: { 
      getGuideCompleteAgenda, 
      getGuideAvailability, 
      setSelectedDate,
      setCurrentView
    }
  } = useIndependentAgendaStore();

  const [monthEvents, setMonthEvents] = useState({});
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const isAdmin = user?.role === 'admin';
  
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Load month events
  useEffect(() => {
    const eventsData = {};
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      
      if (isAdmin && currentGuide) {
        // Admin view: only availability
        const availability = getGuideAvailability(currentGuide, currentDate);
        eventsData[dateKey] = {
          events: availability?.occupiedSlots || [],
          availability: availability?.availableSlots || []
        };
      } else if (!isAdmin && user?.id) {
        // Guide view: complete agenda
        const agenda = getGuideCompleteAgenda(user.id, currentDate);
        eventsData[dateKey] = {
          events: agenda?.allEvents || [],
          availability: []
        };
      }

      currentDate = addDays(currentDate, 1);
    }

    setMonthEvents(eventsData);
  }, [selectedDate, currentGuide, user?.id, isAdmin, getGuideAvailability, getGuideCompleteAgenda, startDate, endDate]);

  const handleDateHover = (date, isHovering) => {
    if (isHovering) {
      setHoveredDate(format(date, 'yyyy-MM-dd'));
    } else {
      setHoveredDate(null);
    }
  };

  const getDayEventIndicators = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayData = monthEvents[dateKey] || { events: [], availability: [] };
    
    const personalEvents = dayData.events.filter(e => e.type === 'personal').length;
    const companyTours = dayData.events.filter(e => e.type === 'company_tour').length;
    const occupiedSlots = dayData.events.filter(e => e.type === 'occupied').length;
    const availableSlots = dayData.availability.length;

    return {
      personalEvents,
      companyTours,
      occupiedSlots,
      availableSlots,
      hasEvents: dayData.events.length > 0,
      hasAvailability: availableSlots > 0,
      totalEvents: dayData.events.length
    };
  };

  const handleEventBadgeClick = (date, eventType, event, onEventClick) => {
    event.preventDefault();
    event.stopPropagation();
    
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayData = monthEvents[dateKey] || { events: [] };
    const eventsOfType = dayData.events.filter(e => e.type === eventType);
    
    if (eventsOfType.length === 1 && onEventClick) {
      // If only one event, click it directly
      onEventClick(eventsOfType[0]);
    } else {
      // If multiple events, go to day view
      setSelectedDate(date);
      setCurrentView('day');
    }
  };

  const totalEvents = Object.values(monthEvents).reduce((total, dayData) => 
    total + (dayData.events?.length || 0), 0
  );

  const availableDays = Object.values(monthEvents).filter(dayData => 
    (dayData.availability?.length || 0) > 0
  ).length;

  return {
    monthStart,
    monthEnd,
    startDate,
    endDate,
    monthEvents,
    hoveredDate,
    selectedEvent,
    isAdmin,
    totalEvents,
    availableDays,
    setSelectedDate,
    setCurrentView,
    setSelectedEvent,
    handleDateHover,
    getDayEventIndicators,
    handleEventBadgeClick
  };
};

export default useMonthView;