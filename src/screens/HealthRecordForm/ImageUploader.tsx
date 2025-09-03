import React from 'react';
import { View } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import ImageGallery from '../../components/ImageGallery';
import { imageTypes } from './types';
import { styles } from './styles';

interface ImageUploaderProps {
  images: Array<{
    uri: string;
    type: 'symptom' | 'damage' | 'treatment' | 'recovery';
    date: Date;
    description?: string;
  }>;
  onAddImage: (image: { uri: string; type: string; date: Date }) => void;
  onRemoveImage: (index: number) => void;
  onChangeType: (index: number, type: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onAddImage,
  onRemoveImage,
  onChangeType,
}) => {
  const handleAddImage = (uri: string) => {
    onAddImage({
      uri,
      type: 'symptom',
      date: new Date(),
    });
  };

  return (
    <View>
      <ImageGallery
        images={images.map(img => img.uri)}
        onAddImage={handleAddImage}
        onRemoveImage={onRemoveImage}
        title="Imágenes del Problema"
      />

      {images.map((image, index) => (
        <View key={index} style={styles.imageTypeContainer}>
          <Text style={styles.imageTypeLabel}>
            Imagen {index + 1}:
          </Text>
          <SegmentedButtons
            value={image.type}
            onValueChange={(value) => onChangeType(index, value)}
            buttons={imageTypes}
          />
        </View>
      ))}
    </View>
  );
};

export default ImageUploader;
