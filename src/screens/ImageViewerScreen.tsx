import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import { Appbar, IconButton, Text } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface ImageViewerScreenProps {
  route: {
    params: {
      images: string[];
      initialIndex: number;
      title?: string;
    };
  };
  navigation: any;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ImageViewerScreen: React.FC<ImageViewerScreenProps> = ({ route, navigation }) => {
  const { images, initialIndex, title } = route.params;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showControls, setShowControls] = useState(true);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleShare = async () => {
    try {
      const result = await Share.share({
        url: Platform.OS === 'ios' ? images[currentIndex] : images[currentIndex],
        message: Platform.OS === 'ios' ? '' : images[currentIndex],
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.error(error);
    }
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex =
      direction === 'next'
        ? (currentIndex + 1) % images.length
        : (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    scale.value = withSpring(1);
    savedScale.value = 1;
  };

  const handleDoubleTap = () => {
    const targetScale = savedScale.value === 1 ? 2 : 1;
    scale.value = withSpring(targetScale);
    savedScale.value = targetScale;
  };

  return (
    <View style={styles.container}>
      {showControls && (
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={title || `Imagen ${currentIndex + 1} de ${images.length}`} />
          <Appbar.Action icon="share" onPress={handleShare} />
        </Appbar.Header>
      )}

      <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowControls(!showControls)}
          onLongPress={handleShare}
          onDoubleTap={handleDoubleTap}
          style={styles.imageTouchable}
        >
          <Animated.View style={[styles.imageWrapper, animatedStyles]}>
            <Image
              source={{ uri: images[currentIndex] }}
              style={styles.image}
              resizeMode="contain"
            />
          </Animated.View>
        </TouchableOpacity>

        {showControls && images.length > 1 && (
          <>
            <IconButton
              icon="chevron-left"
              size={32}
              iconColor="white"
              style={[styles.navButton, styles.leftButton]}
              onPress={() => navigateImage('prev')}
            />
            <IconButton
              icon="chevron-right"
              size={32}
              iconColor="white"
              style={[styles.navButton, styles.rightButton]}
              onPress={() => navigateImage('next')}
            />
          </>
        )}

        {showControls && (
          <View style={styles.pagination}>
            <Text style={styles.paginationText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTouchable: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  navButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    margin: 0,
  },
  leftButton: {
    left: 0,
  },
  rightButton: {
    right: 0,
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  paginationText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ImageViewerScreen;
