import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const useEventForm = (initialEvent = null) => {
  const { t } = useTranslation();
  
  const initialFormState = {
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    allDay: false,
    category: 'personal',
    recurring: false,
    reminder: '15',
    priority: 'medium',
    visibility: 'private',
    attendees: [],
    tags: []
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load event data when provided
  useEffect(() => {
    if (initialEvent) {
      setFormData({
        ...initialFormState,
        ...initialEvent,
        date: initialEvent.date || '',
        startTime: initialEvent.startTime || '',
        endTime: initialEvent.endTime || ''
      });
      setIsDirty(false);
    }
  }, [initialEvent]);

  // Update form field
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Batch update multiple fields
  const updateFields = (updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
    setIsDirty(true);
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = t('calendar.errors.titleRequired');
    } else if (formData.title.length > 100) {
      newErrors.title = t('calendar.errors.titleTooLong');
    }

    // Date validation
    if (!formData.date) {
      newErrors.date = t('calendar.errors.dateRequired');
    }

    // Time validation for non-allDay events
    if (!formData.allDay) {
      if (!formData.startTime) {
        newErrors.startTime = t('calendar.errors.startTimeRequired');
      }
      if (!formData.endTime) {
        newErrors.endTime = t('calendar.errors.endTimeRequired');
      }
      if (formData.startTime && formData.endTime) {
        const start = new Date(`2000-01-01 ${formData.startTime}`);
        const end = new Date(`2000-01-01 ${formData.endTime}`);
        if (start >= end) {
          newErrors.endTime = t('calendar.errors.invalidTimeRange');
        }
      }
    }

    // Description length validation
    if (formData.description && formData.description.length > 500) {
      newErrors.description = t('calendar.errors.descriptionTooLong');
    }

    // Location length validation
    if (formData.location && formData.location.length > 200) {
      newErrors.location = t('calendar.errors.locationTooLong');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Reset form
  const reset = () => {
    setFormData(initialFormState);
    setErrors({});
    setIsDirty(false);
    setIsSubmitting(false);
  };

  // Handle all day toggle
  const toggleAllDay = () => {
    const newAllDay = !formData.allDay;
    updateFields({
      allDay: newAllDay,
      startTime: newAllDay ? '' : '09:00',
      endTime: newAllDay ? '' : '10:00'
    });
  };

  // Add attendee
  const addAttendee = (email) => {
    if (!email || formData.attendees.includes(email)) return;
    
    updateField('attendees', [...formData.attendees, email]);
  };

  // Remove attendee
  const removeAttendee = (email) => {
    updateField('attendees', formData.attendees.filter(e => e !== email));
  };

  // Add tag
  const addTag = (tag) => {
    if (!tag || formData.tags.includes(tag)) return;
    
    updateField('tags', [...formData.tags, tag]);
  };

  // Remove tag
  const removeTag = (tag) => {
    updateField('tags', formData.tags.filter(t => t !== tag));
  };

  // Get form data for submission
  const getFormData = () => {
    return {
      ...formData,
      // Ensure times are empty strings for allDay events
      startTime: formData.allDay ? '' : formData.startTime,
      endTime: formData.allDay ? '' : formData.endTime
    };
  };

  return {
    // State
    formData,
    errors,
    isDirty,
    isSubmitting,
    
    // Actions
    updateField,
    updateFields,
    validate,
    reset,
    toggleAllDay,
    addAttendee,
    removeAttendee,
    addTag,
    removeTag,
    getFormData,
    setIsSubmitting
  };
};

export default useEventForm;