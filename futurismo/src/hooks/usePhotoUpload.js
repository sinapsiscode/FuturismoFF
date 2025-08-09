import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const usePhotoUpload = (photos = [], onPhotosChange, maxPhotos = 5) => {
  const [uploading, setUploading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  const PHOTO_CONFIG = {
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  };

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: t('upload.photos.invalidType', { name: file.name }) };
    }

    if (file.size > PHOTO_CONFIG.maxSize) {
      return { valid: false, error: t('upload.photos.tooLarge', { name: file.name }) };
    }

    return { valid: true };
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    if (photos.length + files.length > maxPhotos) {
      toast.error(t('upload.photos.maxExceeded', { max: maxPhotos }));
      return;
    }

    setUploading(true);
    
    try {
      const newPhotos = [];
      
      for (const file of files) {
        const validation = validateFile(file);
        if (!validation.valid) {
          toast.error(validation.error);
          continue;
        }

        // Create preview URL
        const imageUrl = URL.createObjectURL(file);
        
        // Simulate upload (in production this would upload to server)
        const photoData = {
          id: Date.now() + Math.random(),
          file: file,
          url: imageUrl,
          name: file.name,
          size: file.size,
          uploadedAt: new Date(),
          status: 'uploaded'
        };

        newPhotos.push(photoData);
      }

      const updatedPhotos = [...photos, ...newPhotos];
      onPhotosChange(updatedPhotos);
      
      if (newPhotos.length > 0) {
        toast.success(t('upload.photos.success', { count: newPhotos.length }));
      }
      
    } catch (error) {
      toast.error(t('upload.photos.error'));
      console.error(error);
    } finally {
      setUploading(false);
      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (photoId) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    onPhotosChange(updatedPhotos);
    
    // Release blob URL memory
    const photoToRemove = photos.find(photo => photo.id === photoId);
    if (photoToRemove && photoToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(photoToRemove.url);
    }
    
    toast.success(t('upload.photos.removed'));
  };

  const openPreview = (photo) => {
    setPreviewPhoto(photo);
  };

  const closePreview = () => {
    setPreviewPhoto(null);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (size) => {
    return (size / 1024 / 1024).toFixed(1);
  };

  return {
    // State
    uploading,
    previewPhoto,
    fileInputRef,
    
    // Handlers
    handleFileSelect,
    removePhoto,
    openPreview,
    closePreview,
    openFileSelector,
    
    // Utilities
    formatFileSize,
    canAddMore: photos.length < maxPhotos
  };
};

export default usePhotoUpload;