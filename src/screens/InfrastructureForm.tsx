import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, useTheme, HelperText, SegmentedButtons, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getRealm } from '../services/realm';
import type { Infrastructure } from '../types/models';

interface InfrastructureFormProps {
  route: {
    params: {
      lotId: string;
      infrastructure?: Infrastructure;
    };
  };
  navigation: any;
}

const InfrastructureForm: React.FC<InfrastructureFormProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const existingInfrastructure = route.params?.infrastructure;

  const [type, setType] = useState<'irrigation' | 'greenhouse' | 'storage' | 'other'>(
    existingInfrastructure?.type || 'irrigation'
  );
  const [status, setStatus] = useState<'good' | 'regular' | 'needs_repair' | 'critical'>(
    existingInfrastructure?.status || 'good'
  );
  const [lastInspection, setLastInspection] = useState(
    existingInfrastructure?.lastInspection || new Date()
  );
  const [nextInspection, setNextInspection] = useState(
    existingInfrastructure?.nextInspection || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
  );
  const [notes, setNotes] = useState(existingInfrastructure?.notes || '');
  const [showLastInspectionPicker, setShowLastInspectionPicker] = useState(false);
  const [showNextInspectionPicker, setShowNextInspectionPicker] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const infrastructureTypes = [
    { label: 'Riego', value: 'irrigation' },
    { label: 'Invernadero', value: 'greenhouse' },
    { label: 'Almacén', value: 'storage' },
    { label: 'Otro', value: 'other' },
  ];

  const statusTypes = [
    { label: 'Bueno', value: 'good' },
    { label: 'Regular', value: 'regular' },
    { label: 'Necesita Reparación', value: 'needs_repair' },
    { label: 'Crítico', value: 'critical' },
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (lastInspection > new Date()) {
      newErrors.lastInspection = 'La fecha de última inspección no puede ser futura';
    }
    if (nextInspection < new Date()) {
      newErrors.nextInspection = 'La fecha de próxima inspección debe ser futura';
    }
    if (nextInspection <= lastInspection) {
      newErrors.nextInspection = 'La próxima inspección debe ser posterior a la última';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImagePicker = async (useCamera: boolean) => {
    const options = {
      mediaType: 'photo' as const,
      quality: 0.8,
      maxWidth: 1280,
      maxHeight: 1280,
    };

    try {
      const result = useCamera
        ? await launchCamera(options)
        : await launchImageLibrary(options);

      if (result.assets && result.assets[0]?.uri) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSave = () => {
    if (!validate()) return;

    const realm = getRealm();
    const infrastructureData = {
      id: existingInfrastructure?.id || new Date().getTime().toString(),
      lotId: route.params.lotId,
      type,
      status,
      lastInspection,
      nextInspection,
      notes: notes || undefined,
    };

    try {
      realm.write(() => {
        realm.create(
          'Infrastructure',
          infrastructureData,
          existingInfrastructure ? 'modified' : 'all'
        );
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving infrastructure:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Tipo de Infraestructura
      </Text>
      <SegmentedButtons
        value={type}
        onValueChange={(value: any) => setType(value)}
        buttons={infrastructureTypes}
        style={styles.segmentedButtons}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Estado
      </Text>
      <SegmentedButtons
        value={status}
        onValueChange={(value: any) => setStatus(value)}
        buttons={statusTypes}
        style={styles.segmentedButtons}
      />

      <Button
        mode="outlined"
        onPress={() => setShowLastInspectionPicker(true)}
        style={styles.input}
      >
        Última Inspección: {lastInspection.toLocaleDateString()}
      </Button>
      <HelperText type="error" visible={!!errors.lastInspection}>
        {errors.lastInspection}
      </HelperText>

      <Button
        mode="outlined"
        onPress={() => setShowNextInspectionPicker(true)}
        style={styles.input}
      >
        Próxima Inspección: {nextInspection.toLocaleDateString()}
      </Button>
      <HelperText type="error" visible={!!errors.nextInspection}>
        {errors.nextInspection}
      </HelperText>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Documentación Visual
      </Text>

      <View style={styles.imageButtons}>
        <Button
          mode="contained-tonal"
          onPress={() => handleImagePicker(true)}
          icon="camera"
          style={styles.imageButton}
        >
          Tomar Foto
        </Button>
        <Button
          mode="contained-tonal"
          onPress={() => handleImagePicker(false)}
          icon="image"
          style={styles.imageButton}
        >
          Galería
        </Button>
      </View>

      {images.length > 0 && (
        <View style={styles.imageList}>
          {images.map((uri, index) => (
            <View key={index} style={styles.imageItem}>
              <Text variant="bodyMedium" numberOfLines={1}>
                Imagen {index + 1}
              </Text>
              <Button
                mode="text"
                onPress={() => removeImage(index)}
                icon="delete"
                textColor={theme.colors.error}
              >
                Eliminar
              </Button>
            </View>
          ))}
        </View>
      )}

      <TextInput
        label="Notas y Observaciones"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      {showLastInspectionPicker && (
        <DateTimePicker
          value={lastInspection}
          mode="date"
          maximumDate={new Date()}
          onChange={(event, date) => {
            setShowLastInspectionPicker(false);
            if (date) setLastInspection(date);
          }}
        />
      )}

      {showNextInspectionPicker && (
        <DateTimePicker
          value={nextInspection}
          mode="date"
          minimumDate={new Date()}
          onChange={(event, date) => {
            setShowNextInspectionPicker(false);
            if (date) setNextInspection(date);
          }}
        />
      )}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
        >
          Guardar
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Cancelar
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  imageList: {
    marginBottom: 16,
  },
  imageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  buttonContainer: {
    gap: 8,
    marginTop: 16,
    marginBottom: 32,
  },
  button: {
    marginTop: 8,
  },
});

export default InfrastructureForm;
