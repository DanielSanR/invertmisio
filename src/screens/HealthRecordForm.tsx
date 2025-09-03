import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, useTheme, HelperText, SegmentedButtons, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getRealm } from '../services/realm';
import type { HealthRecord } from '../types/models';

interface HealthRecordFormProps {
  route: {
    params: {
      lotId: string;
      healthRecord?: HealthRecord;
    };
  };
  navigation: any;
}

const HealthRecordForm: React.FC<HealthRecordFormProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const existingRecord = route.params?.healthRecord;

  const [type, setType] = useState<'pest' | 'disease' | 'deficiency' | 'other'>(
    existingRecord?.type || 'pest'
  );
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>(
    existingRecord?.severity || 'low'
  );
  const [description, setDescription] = useState(existingRecord?.description || '');
  const [date, setDate] = useState(existingRecord?.date || new Date());
  const [affectedArea, setAffectedArea] = useState(
    existingRecord?.affectedArea?.toString() || ''
  );
  const [images, setImages] = useState<string[]>(existingRecord?.images || []);
  const [notes, setNotes] = useState(existingRecord?.notes || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const recordTypes = [
    { label: 'Plaga', value: 'pest' },
    { label: 'Enfermedad', value: 'disease' },
    { label: 'Deficiencia', value: 'deficiency' },
    { label: 'Otro', value: 'other' },
  ];

  const severityLevels = [
    { label: 'Bajo', value: 'low' },
    { label: 'Medio', value: 'medium' },
    { label: 'Alto', value: 'high' },
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (affectedArea && isNaN(parseFloat(affectedArea))) {
      newErrors.affectedArea = 'El área afectada debe ser un número';
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
    const healthData = {
      id: existingRecord?.id || new Date().getTime().toString(),
      lotId: route.params.lotId,
      type,
      severity,
      description,
      date,
      affectedArea: affectedArea ? parseFloat(affectedArea) : undefined,
      images,
      notes: notes || undefined,
    };

    try {
      realm.write(() => {
        realm.create('HealthRecord', healthData, existingRecord ? 'modified' : 'all');
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving health record:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <SegmentedButtons
        value={type}
        onValueChange={(value: any) => setType(value)}
        buttons={recordTypes}
        style={styles.segmentedButtons}
      />

      <SegmentedButtons
        value={severity}
        onValueChange={(value: any) => setSeverity(value)}
        buttons={severityLevels}
        style={styles.segmentedButtons}
      />

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        error={!!errors.description}
      />
      <HelperText type="error" visible={!!errors.description}>
        {errors.description}
      </HelperText>

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.input}
      >
        Fecha: {date.toLocaleDateString()}
      </Button>

      <TextInput
        label="Área Afectada (hectáreas)"
        value={affectedArea}
        onChangeText={setAffectedArea}
        keyboardType="numeric"
        style={styles.input}
        error={!!errors.affectedArea}
      />
      <HelperText type="error" visible={!!errors.affectedArea}>
        {errors.affectedArea}
      </HelperText>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Imágenes
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
        label="Notas Adicionales"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
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
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 16,
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

export default HealthRecordForm;
