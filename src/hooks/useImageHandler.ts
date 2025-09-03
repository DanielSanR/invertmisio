import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import imageService, { ImageConfig } from '../services/imageService';

interface UseImageHandlerOptions {
  maxImages?: number;
  config?: ImageConfig;
  onImageAdded?: (uri: string) => void;
  onImageRemoved?: (uri: string) => void;
  onError?: (error: Error) => void;
}

export const useImageHandler = (options: UseImageHandlerOptions = {}) => {
  const {
    maxImages = Infinity,
    config,
    onImageAdded,
    onImageRemoved,
    onError,
  } = options;

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleError = useCallback((error: Error) => {
    console.error('Image handler error:', error);
    if (onError) {
      onError(error);
    } else {
      Alert.alert(
        'Error',
        'Hubo un problema al procesar la imagen. Por favor, intente nuevamente.'
      );
    }
  }, [onError]);

  const addImages = useCallback(async () => {
    if (images.length >= maxImages) {
      Alert.alert(
        'Límite alcanzado',
        `No se pueden agregar más de ${maxImages} imágenes.`
      );
      return;
    }

    try {
      setLoading(true);
      const newImages = await imageService.pickImages(config);
      
      if (newImages.length > 0) {
        const remainingSlots = maxImages - images.length;
        const imagesToAdd = newImages.slice(0, remainingSlots);

        setImages(prev => [...prev, ...imagesToAdd]);
        imagesToAdd.forEach(uri => onImageAdded?.(uri));

        if (newImages.length > remainingSlots) {
          Alert.alert(
            'Algunas imágenes no fueron agregadas',
            `Solo se agregaron ${remainingSlots} de ${newImages.length} imágenes debido al límite.`
          );
        }
      }
    } catch (error) {
      handleError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [images.length, maxImages, config, onImageAdded, handleError]);

  const takePhoto = useCallback(async () => {
    if (images.length >= maxImages) {
      Alert.alert(
        'Límite alcanzado',
        `No se pueden agregar más de ${maxImages} imágenes.`
      );
      return;
    }

    try {
      setLoading(true);
      const imageUri = await imageService.takePhoto(config);
      
      if (imageUri) {
        setImages(prev => [...prev, imageUri]);
        onImageAdded?.(imageUri);
      }
    } catch (error) {
      handleError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [images.length, maxImages, config, onImageAdded, handleError]);

  const removeImage = useCallback(async (index: number) => {
    try {
      const imageUri = images[index];
      await imageService.deleteImage(imageUri);
      
      setImages(prev => prev.filter((_, i) => i !== index));
      onImageRemoved?.(imageUri);
    } catch (error) {
      handleError(error as Error);
    }
  }, [images, onImageRemoved, handleError]);

  const clearImages = useCallback(async () => {
    try {
      await Promise.all(images.map(uri => imageService.deleteImage(uri)));
      setImages([]);
      images.forEach(uri => onImageRemoved?.(uri));
    } catch (error) {
      handleError(error as Error);
    }
  }, [images, onImageRemoved, handleError]);

  return {
    images,
    loading,
    addImages,
    takePhoto,
    removeImage,
    clearImages,
  };
};

export default useImageHandler;
