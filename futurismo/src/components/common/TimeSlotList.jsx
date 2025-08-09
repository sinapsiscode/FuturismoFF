import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ClockIcon } from '@heroicons/react/24/outline';

const TimeSlotList = ({ timeSlots, viewMode, onAddSlot, onRemoveSlot }) => {
  const { t } = useTranslation();
  const [newSlot, setNewSlot] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAddSlot = () => {
    if (!showInput) {
      setShowInput(true);
      return;
    }

    if (newSlot && /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(newSlot)) {
      const success = onAddSlot(newSlot);
      if (success) {
        setNewSlot('');
        setShowInput(false);
      }
    }
  };

  const handleCancel = () => {
    setNewSlot('');
    setShowInput(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-md font-medium text-gray-900 flex items-center">
          <ClockIcon className="h-4 w-4 mr-2 text-gray-600" />
          {t('guides.availability.timeSlots')}
        </h5>
        {viewMode === 'edit' && !showInput && (
          <button
            onClick={handleAddSlot}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            + {t('guides.availability.addSlot')}
          </button>
        )}
      </div>

      {showInput && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('guides.availability.enterTimeSlot')}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              placeholder="09:00-13:00"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleAddSlot}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('common.add')}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-600">
            {t('guides.availability.slotFormat')}
          </p>
        </div>
      )}

      <div className="space-y-2">
        {timeSlots?.length > 0 ? (
          timeSlots.map((slot, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <span className="text-gray-700 font-medium">{slot}</span>
              {viewMode === 'edit' && (
                <button
                  onClick={() => onRemoveSlot(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  {t('common.remove')}
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm italic">
            {t('guides.availability.noSlots')}
          </p>
        )}
      </div>
    </div>
  );
};

TimeSlotList.propTypes = {
  timeSlots: PropTypes.arrayOf(PropTypes.string),
  viewMode: PropTypes.oneOf(['edit', 'view']).isRequired,
  onAddSlot: PropTypes.func.isRequired,
  onRemoveSlot: PropTypes.func.isRequired
};

export default TimeSlotList;