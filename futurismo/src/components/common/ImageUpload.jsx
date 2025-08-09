import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import useImageUpload from '../../hooks/useImageUpload';
import ImagePreview from './ImagePreview';
import ImageDropZone from './ImageDropZone';

const ImageUpload = ({ onImageSelect, initialImage = null, error = null }) => {
  const { t } = useTranslation();
  const {
    dragActive,
    preview,
    uploading,
    fileInputRef,
    handleDrag,
    handleDrop,
    handleFileSelect,
    removeImage,
    openFileSelector,
    acceptedFormats
  } = useImageUpload(onImageSelect, initialImage);

  return (
    <div className="w-full">
      <label className="label">{t('upload.profilePhoto')}</label>
      
      {preview ? (
        <ImagePreview
          preview={preview}
          onRemove={removeImage}
          onChangeImage={openFileSelector}
        />
      ) : (
        <ImageDropZone
          dragActive={dragActive}
          uploading={uploading}
          error={error}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileSelector}
        />
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats}
        onChange={handleFileSelect}
        className="hidden"
        aria-label={t('upload.selectFile')}
      />

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <ExclamationTriangleIcon className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Additional help */}
      <p className="mt-2 text-xs text-gray-500">
        {t('upload.recommendation')}
      </p>
    </div>
  );
};

ImageUpload.propTypes = {
  onImageSelect: PropTypes.func.isRequired,
  initialImage: PropTypes.string,
  error: PropTypes.string
};

export default ImageUpload;