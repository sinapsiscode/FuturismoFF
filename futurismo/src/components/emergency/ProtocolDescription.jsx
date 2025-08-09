import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const ProtocolDescription = ({ protocol }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-lg font-medium text-blue-900 mb-2 flex items-center">
        <ShieldCheckIcon className="w-5 h-5 mr-2" />
        {t('emergency.protocol.protocolDescription')}
      </h3>
      <p className="text-blue-800">{protocol.description}</p>
      <div className="mt-3 text-sm text-blue-700">
        <span className="font-medium">{t('emergency.protocol.lastUpdate')}:</span> {protocol.lastUpdated}
      </div>
    </div>
  );
};

ProtocolDescription.propTypes = {
  protocol: PropTypes.shape({
    description: PropTypes.string.isRequired,
    lastUpdated: PropTypes.string.isRequired
  }).isRequired
};

export default ProtocolDescription;