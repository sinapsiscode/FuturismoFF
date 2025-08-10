import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

const ProviderFormHeader = ({ isEditing, onCancel, onSubmit }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">
        {isEditing ? t('providers.form.editTitle') : t('providers.form.createTitle')}
      </h2>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <XMarkIcon className="w-5 h-5 inline mr-2" />
          {t('common.cancel')}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <DocumentCheckIcon className="w-5 h-5 inline mr-2" />
          {t('common.save')}
        </button>
      </div>
    </div>
  );
};

ProviderFormHeader.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ProviderFormHeader;