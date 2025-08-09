import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const useImageUpload = (onImageSelect, initialImage = null) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(initialImage);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { t } = useTranslation();

  const IMAGE_CONFIG = {
    validTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
    uploadDelay: 1000 // Simulated upload delay
  };

  // Validate image file
  const validateImageFile = (file) => {
    if (!IMAGE_CONFIG.validTypes.includes(file.type)) {
      return { valid: false, error: t('upload.invalidFormat') };
    }

    if (file.size > IMAGE_CONFIG.maxSize) {
      return { valid: false, error: t('upload.fileTooLarge') };
    }

    return { valid: true };
  };

  // Process selected file
  const processFile = async (file) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      onImageSelect(null, validation.error);
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        setUploading(false);
      };
      reader.readAsDataURL(file);

      // Simulate upload (in production this would upload to a server)
      await new Promise(resolve => setTimeout(resolve, IMAGE_CONFIG.uploadDelay));

      // Return processed file
      onImageSelect(file, null);
    } catch (error) {
      setUploading(false);
      onImageSelect(null, t('upload.uploadError'));
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Remove image
  const removeImage = () => {
    setPreview(null);
    onImageSelect(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Open file selector
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return {
    // State
    dragActive,
    preview,
    uploading,
    fileInputRef,

    // Handlers
    handleDrag,
    handleDrop,
    handleFileSelect,
    removeImage,
    openFileSelector,

    // Config
    acceptedFormats: 'image/*'
  };
};

export default useImageUpload;