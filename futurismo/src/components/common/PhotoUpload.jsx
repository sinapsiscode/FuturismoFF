import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { PhotoIcon, PlusIcon } from '@heroicons/react/24/outline';
import usePhotoUpload from '../../hooks/usePhotoUpload';
import PhotoGrid from './PhotoGrid';
import PhotoPreviewModal from './PhotoPreviewModal';

const PhotoUpload = ({ 
  photos = [], 
  onPhotosChange, 
  maxPhotos = 5, 
  acceptedTypes = "image/*" 
}) => {
  const { t } = useTranslation();
  const {
    uploading,
    previewPhoto,
    fileInputRef,
    handleFileSelect,
    removePhoto,
    openPreview,
    closePreview,
    openFileSelector,
    formatFileSize,
    canAddMore
  } = usePhotoUpload(photos, onPhotosChange, maxPhotos);

  return (
    <div className="space-y-3">
      {/* Upload buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Botón para cámara (solo en móviles) */}
        {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && (
          <button
            type="button"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.setAttribute('capture', 'environment');
                fileInputRef.current.click();
              }
            }}
            disabled={uploading || !canAddMore}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t('upload.photos.uploading')}
              </>
            ) : (
              <>
                <PhotoIcon className="w-4 h-4" />
                {t('upload.photos.takePhoto')}
              </>
            )}
          </button>
        )}
        
        {/* Botón para seleccionar de galería */}
        <button
          type="button"
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.removeAttribute('capture');
              fileInputRef.current.click();
            }
          }}
          disabled={uploading || !canAddMore}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
              {t('upload.photos.uploading')}
            </>
          ) : (
            <>
              <PlusIcon className="w-4 h-4" />
              {t('upload.photos.selectPhotos')}
            </>
          )}
        </button>
        
        <span className="text-sm text-gray-500">
          {t('upload.photos.counter', { current: photos.length, max: maxPhotos })}
        </span>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label={t('upload.photos.selectFiles')}
      />

      {/* Photo grid */}
      {photos.length > 0 && (
        <PhotoGrid
          photos={photos}
          onPreview={openPreview}
          onRemove={removePhoto}
        />
      )}

      {/* Empty state */}
      {photos.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 mb-2">
            {t('upload.photos.noPhotos')}
          </p>
          <p className="text-xs text-gray-500">
            {t('upload.photos.photosHelp')}
          </p>
        </div>
      )}

      {/* Preview modal */}
      <PhotoPreviewModal
        photo={previewPhoto}
        onClose={closePreview}
        formatFileSize={formatFileSize}
      />
    </div>
  );
};

PhotoUpload.propTypes = {
  photos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    url: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    file: PropTypes.object,
    uploadedAt: PropTypes.instanceOf(Date),
    status: PropTypes.string
  })),
  onPhotosChange: PropTypes.func.isRequired,
  maxPhotos: PropTypes.number,
  acceptedTypes: PropTypes.string
};

export default PhotoUpload;