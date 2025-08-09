import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { PhotoIcon } from '@heroicons/react/24/outline';

const ImageDropZone = ({ 
  dragActive, 
  uploading, 
  error, 
  onDragEnter, 
  onDragLeave, 
  onDragOver, 
  onDrop, 
  onClick 
}) => {
  const { t } = useTranslation();

  const getClassName = () => {
    const baseClass = 'relative w-full h-48 border-2 border-dashed rounded-lg transition-colors cursor-pointer';
    if (dragActive) return `${baseClass} border-primary-500 bg-primary-50`;
    if (error) return `${baseClass} border-red-300 bg-red-50`;
    return `${baseClass} border-gray-300 bg-gray-50 hover:border-gray-400`;
  };

  return (
    <div
      className={getClassName()}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        {uploading ? (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-3"></div>
            <p className="text-sm text-gray-600">{t('upload.uploading')}</p>
          </>
        ) : (
          <>
            <PhotoIcon className={`w-12 h-12 mb-3 ${error ? 'text-red-400' : 'text-gray-400'}`} />
            <p className={`text-sm font-medium mb-1 ${error ? 'text-red-600' : 'text-gray-700'}`}>
              {dragActive ? t('upload.dropHere') : t('upload.dragOrClick')}
            </p>
            <p className="text-xs text-gray-500">
              {t('upload.supportedFormats')}
            </p>
            <p className="text-xs text-gray-500">
              {t('upload.maxSize')}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

ImageDropZone.propTypes = {
  dragActive: PropTypes.bool.isRequired,
  uploading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onDragEnter: PropTypes.func.isRequired,
  onDragLeave: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};

export default ImageDropZone;