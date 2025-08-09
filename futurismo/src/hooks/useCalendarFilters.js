import { useState } from 'react';

const useCalendarFilters = () => {
  const [filters, setFilters] = useState({
    showWeekends: true,
    showPersonalEvents: true,
    showCompanyTours: true,
    showOccupiedTime: true,
    workingHoursOnly: false,
    showPastEvents: false
  });

  const [timeFilter, setTimeFilter] = useState('all'); // all, today, thisWeek, thisMonth

  const toggleFilter = (filterKey) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const resetFilters = () => {
    setFilters({
      showWeekends: true,
      showPersonalEvents: true,
      showCompanyTours: true,
      showOccupiedTime: true,
      workingHoursOnly: false,
      showPastEvents: false
    });
    setTimeFilter('all');
  };

  return {
    filters,
    timeFilter,
    setTimeFilter,
    toggleFilter,
    resetFilters
  };
};

export default useCalendarFilters;