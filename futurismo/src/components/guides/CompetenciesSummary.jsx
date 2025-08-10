import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { 
  GlobeAltIcon, 
  AcademicCapIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const CompetenciesSummary = ({ languages, museums, stats }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <CheckCircleIcon className="w-5 h-5 mr-2 text-indigo-500" />
        {t('guides.profile.competenciesSummary')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <GlobeAltIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">
            {t('guides.profile.multilingual')}
          </h4>
          <p className="text-sm text-gray-600">
            {t('guides.profile.mastersLanguages', { count: languages.length })}
          </p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <AcademicCapIcon className="w-8 h-8 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">
            {t('guides.profile.specialist')}
          </h4>
          <p className="text-sm text-gray-600">
            {t('guides.profile.knowsMuseums', { count: museums.length })}
          </p>
          <div className="mt-2">
            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              {t('guides.profile.specializations', { count: museums.length })}
            </span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircleIcon className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">
            {t('guides.profile.experienced')}
          </h4>
          <p className="text-sm text-gray-600">
            {t('guides.profile.yearsOfExperience', { years: stats.yearsExperience })}
          </p>
          <div className="mt-2">
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              {t('guides.profile.completedTours', { count: stats.toursCompleted })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

CompetenciesSummary.propTypes = {
  languages: PropTypes.array.isRequired,
  museums: PropTypes.array.isRequired,
  stats: PropTypes.shape({
    yearsExperience: PropTypes.number.isRequired,
    toursCompleted: PropTypes.number.isRequired
  }).isRequired
};

export default CompetenciesSummary;