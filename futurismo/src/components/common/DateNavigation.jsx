import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const DateNavigation = ({ selectedDate, onDateChange, onNavigate }) => {
  const { t, i18n } = useTranslation();

  const formatDate = (date) => {
    return date.toLocaleDateString(i18n.language === 'es' ? 'es-PE' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => onNavigate(-1)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label={t('common.previousDay')}
      >
        ←
      </button>
      <div className="text-center">
        <h4 className="text-lg font-medium text-gray-900">
          {formatDate(selectedDate)}
        </h4>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => onDateChange(new Date(e.target.value))}
          className="mt-1 text-sm text-gray-600 border-none bg-transparent text-center"
          aria-label={t('common.selectDate')}
        />
      </div>
      <button
        onClick={() => onNavigate(1)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label={t('common.nextDay')}
      >
        →
      </button>
    </div>
  );
};

DateNavigation.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  onDateChange: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired
};

export default DateNavigation;