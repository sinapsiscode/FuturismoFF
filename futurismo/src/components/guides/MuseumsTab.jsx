import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { LEVEL_OPTIONS } from '../../constants/guidesConstants';

const MuseumsTab = ({ 
  register, 
  museumFields, 
  appendMuseum, 
  removeMuseum 
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">
          {t('guides.form.sections.museumKnowledge')}
        </h4>
        <button
          type="button"
          onClick={() => appendMuseum({ name: '', expertise: 'principiante' })}
          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>{t('guides.form.buttons.addMuseum')}</span>
        </button>
      </div>

      <div className="space-y-4">
        {museumFields.map((field, index) => (
          <div key={field.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('guides.form.fields.museumName')}
                </label>
                <input
                  {...register(`museums.${index}.name`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('guides.form.placeholders.museumName')}
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('guides.form.fields.expertiseLevel')}
                </label>
                <select
                  {...register(`museums.${index}.expertise`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {LEVEL_OPTIONS.filter(opt => opt.value !== 'nativo').map(option => (
                    <option key={option.value} value={option.value}>
                      {t(option.label)}
                    </option>
                  ))}
                </select>
              </div>

              {museumFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMuseum(index)}
                  className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

MuseumsTab.propTypes = {
  register: PropTypes.func.isRequired,
  museumFields: PropTypes.array.isRequired,
  appendMuseum: PropTypes.func.isRequired,
  removeMuseum: PropTypes.func.isRequired
};

export default MuseumsTab;