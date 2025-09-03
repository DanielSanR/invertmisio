import React from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { useImageHandler } from '../hooks/useImageHandler';

interface ImageGalleryProps {
  images: string[];
  onImagePress?: (index: number) => void;
  onAddImage?: (uri: string) => void;
  onRemoveImage?: (index: number) => void;
  title?: string;
  editable?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onImagePress,
  onAddImage,
  onRemoveImage,
  title = 'Imágenes',
  editable = true,
}) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const imageSize = (screenWidth - 48) / 2; // 2 images per row with padding

  const { loading, addImages, takePhoto } = useImageHandler({
    config: {
      maxWidth: 1280,
      maxHeight: 1280,
      quality: 80,
    },
    onImageAdded: onAddImage,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium">{title}</Text>
        {editable && (
          <View style={styles.actions}>
            <IconButton
              icon="camera"
              size={24}
              onPress={takePhoto}
              disabled={loading}
            />
            <IconButton
              icon="image"
              size={24}
              onPress={addImages}
              disabled={loading}
            />
          </View>
        )}
      </View>

      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageGrid}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <TouchableOpacity
                onPress={() => onImagePress && onImagePress(index)}
                style={[styles.imageWrapper, { width: imageSize, height: imageSize }]}
              >
                <Image
                  source={{ uri }}
                  style={styles.image}
                  resizeMode="cover"
                />
                {editable && onRemoveImage && (
                  <IconButton
                    icon="close-circle"
                    size={24}
                    iconColor={theme.colors.error}
                    style={styles.removeButton}
                    onPress={() => onRemoveImage(index)}
                  />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
  },
  scrollContent: {
    padding: 8,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    marginBottom: 16,
  },
  imageWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 0,
  },
});

export default ImageGallery;
