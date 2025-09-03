import { Platform, Image } from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse, Asset } from 'react-native-image-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import * as RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';

export interface ImageConfig {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  rotation?: number;
  path?: string;
}

const DEFAULT_CONFIG: ImageConfig = {
  maxWidth: 1280,
  maxHeight: 1280,
  quality: 80,
  rotation: 0,
};

const IMAGE_DIR = `${RNFS.DocumentDirectoryPath}/images`;

// Ensure the images directory exists
const ensureImageDir = async () => {
  const exists = await RNFS.exists(IMAGE_DIR);
  if (!exists) {
    await RNFS.mkdir(IMAGE_DIR);
  }
};

// Generate a unique filename for the image
const generateImageFilename = (originalUri: string) => {
  const extension = originalUri.split('.').pop() || 'jpg';
  return `${uuid.v4()}.${extension}`;
};

// Copy and compress an image to the app's storage
const processAndSaveImage = async (
  uri: string,
  config: ImageConfig = DEFAULT_CONFIG
): Promise<string> => {
  try {
    await ensureImageDir();

    // Resize and compress the image
    const resizedImage = await ImageResizer.createResizedImage(
      uri,
      config.maxWidth || DEFAULT_CONFIG.maxWidth!,
      config.maxHeight || DEFAULT_CONFIG.maxHeight!,
      'JPEG',
      config.quality || DEFAULT_CONFIG.quality!,
      config.rotation || DEFAULT_CONFIG.rotation!,
      undefined,
      false,
      {
        mode: 'contain',
        onlyScaleDown: true,
      }
    );

    // Generate a unique filename
    const filename = generateImageFilename(uri);
    const destinationPath = `${IMAGE_DIR}/${filename}`;

    // Copy the processed image to app storage
    await RNFS.copyFile(resizedImage.uri, destinationPath);

    // Clean up the temporary resized image
    await RNFS.unlink(resizedImage.uri);

    return destinationPath;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

// Delete an image from storage
const deleteImage = async (uri: string): Promise<void> => {
  try {
    if (await RNFS.exists(uri)) {
      await RNFS.unlink(uri);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Get image file size in MB
const getImageSize = async (uri: string): Promise<number> => {
  try {
    const stats = await RNFS.stat(uri);
    return stats.size / (1024 * 1024); // Convert bytes to MB
  } catch (error) {
    console.error('Error getting image size:', error);
    return 0;
  }
};

// Pick multiple images from gallery with compression
const pickImages = async (
  config: ImageConfig = DEFAULT_CONFIG
): Promise<string[]> => {
  try {
    const response = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 0, // 0 means no limit
      quality: 1, // Get full quality, we'll compress later
    });

    if (response.assets) {
      const processedImages = await Promise.all(
        response.assets.map(asset => processAndSaveImage(asset.uri!, config))
      );
      return processedImages;
    }

    return [];
  } catch (error) {
    console.error('Error picking images:', error);
    throw error;
  }
};

// Take a photo with camera and compress
const takePhoto = async (
  config: ImageConfig = DEFAULT_CONFIG
): Promise<string | null> => {
  try {
    const response = await launchCamera({
      mediaType: 'photo',
      quality: 1, // Get full quality, we'll compress later
    });

    if (response.assets && response.assets[0]) {
      const processedImage = await processAndSaveImage(response.assets[0].uri!, config);
      return processedImage;
    }

    return null;
  } catch (error) {
    console.error('Error taking photo:', error);
    throw error;
  }
};

// Get image dimensions
const getImageDimensions = async (uri: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      error => reject(error)
    );
  });
};

// Batch process existing images
const batchProcessImages = async (
  uris: string[],
  config: ImageConfig = DEFAULT_CONFIG
): Promise<string[]> => {
  try {
    const processedImages = await Promise.all(
      uris.map(uri => processAndSaveImage(uri, config))
    );
    return processedImages;
  } catch (error) {
    console.error('Error batch processing images:', error);
    throw error;
  }
};

// Clean up unused images
const cleanupUnusedImages = async (usedImageUris: string[]): Promise<void> => {
  try {
    const files = await RNFS.readDir(IMAGE_DIR);
    for (const file of files) {
      if (!usedImageUris.includes(file.path)) {
        await RNFS.unlink(file.path);
      }
    }
  } catch (error) {
    console.error('Error cleaning up images:', error);
    throw error;
  }
};

export const imageService = {
  processAndSaveImage,
  deleteImage,
  getImageSize,
  pickImages,
  takePhoto,
  getImageDimensions,
  batchProcessImages,
  cleanupUnusedImages,
};

export default imageService;
