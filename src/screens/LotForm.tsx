import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Platform } from 'react-native';
import {
  TextInput,
  Button,
  useTheme,
  HelperText,
  SegmentedButtons,
  Text,
  Portal,
  Modal,
} from 'react-native-paper';
import MapView, { Polygon, MapEvent } from 'react-native-maps';
import { useAuth } from '../context/AuthContext';
import { getRealm } from '../services/realm';
import type { Location, Lot } from '../types/models';

interface LotFormProps {
  route?: {
    params?: {
      lot?: Lot;
    };
  };
  navigation: any;
}

const LotForm: React.FC<LotFormProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const existingLot = route?.params?.lot;

  // Basic Information
  const [name, setName] = useState(existingLot?.name || '');
  const [code, setCode] = useState(existingLot?.code || '');
  const [area, setArea] = useState(existingLot?.area.toString() || '');
  const [coordinates, setCoordinates] = useState<Location[]>(existingLot?.coordinates || []);
  const [status, setStatus] = useState<Lot['status']>(existingLot?.status || 'active');

  // Physical Characteristics
  const [soilType, setSoilType] = useState(existingLot?.soilType || '');
  const [slope, setSlope] = useState(existingLot?.slope?.toString() || '');
  const [orientation, setOrientation] = useState<Lot['orientation']>(existingLot?.orientation || 'N');

  // Irrigation
  const [irrigationType, setIrrigationType] = useState<'drip' | 'sprinkler' | 'flood' | 'none'>(
    existingLot?.irrigation?.type || 'none'
  );
  const [irrigationDescription, setIrrigationDescription] = useState(
    existingLot?.irrigation?.description || ''
  );

  // Additional Information
  const [notes, setNotes] = useState(existingLot?.notes || '');
  const [lastInspectionDate, setLastInspectionDate] = useState<Date>(
    existingLot?.lastInspectionDate || new Date()
  );

  // Map Drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const lotStatuses = [
    { label: 'Activo', value: 'active' },
    { label: 'Barbecho', value: 'fallow' },
    { label: 'Preparación', value: 'preparation' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  const orientations = [
    { label: 'N', value: 'N' },
    { label: 'S', value: 'S' },
    { label: 'E', value: 'E' },
    { label: 'W', value: 'W' },
    { label: 'NE', value: 'NE' },
    { label: 'NW', value: 'NW' },
    { label: 'SE', value: 'SE' },
    { label: 'SW', value: 'SW' },
  ];

  const irrigationTypes = [
    { label: 'Goteo', value: 'drip' },
    { label: 'Aspersión', value: 'sprinkler' },
    { label: 'Inundación', value: 'flood' },
    { label: 'Ninguno', value: 'none' },
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!code.trim()) {
      newErrors.code = 'El código es requerido';
    }
    if (!area.trim()) {
      newErrors.area = 'El área es requerida';
    } else if (isNaN(parseFloat(area)) || parseFloat(area) <= 0) {
      newErrors.area = 'El área debe ser un número positivo';
    }
    if (coordinates.length < 3) {
      newErrors.coordinates = 'Dibuje el perímetro del lote (mínimo 3 puntos)';
    }
    if (slope && (isNaN(parseFloat(slope)) || parseFloat(slope) < 0 || parseFloat(slope) > 100)) {
      newErrors.slope = 'La pendiente debe ser un porcentaje entre 0 y 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMapPress = (event: MapEvent) => {
    if (!isDrawing) return;

    const newCoordinate = {
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    };

    setCoordinates([...coordinates, newCoordinate]);
  };

  const handleSave = async () => {
    if (!validate()) return;

    const realm = getRealm();
    const lotData = {
      id: existingLot?.id || new Date().getTime().toString(),
      name,
      code,
      area: parseFloat(area),
      coordinates,
      soilType: soilType || undefined,
      irrigation: {
        type: irrigationType,
        description: irrigationDescription || undefined,
      },
      slope: slope ? parseFloat(slope) : undefined,
      orientation,
      status,
      notes: notes || undefined,
      createdAt: existingLot?.createdAt || new Date(),
      updatedAt: new Date(),
      lastInspectionDate,
      ownerId: user!.id,
      organizationId: user!.organization || user!.id,
    };

    try {
      realm.write(() => {
        realm.create('Lot', lotData, existingLot ? 'modified' : 'all');
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving lot:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Información Básica
      </Text>

      <TextInput
        label="Nombre del Lote"
        value={name}
        onChangeText={setName}
        style={styles.input}
        error={!!errors.name}
      />
      <HelperText type="error" visible={!!errors.name}>
        {errors.name}
      </HelperText>

      <TextInput
        label="Código"
        value={code}
        onChangeText={setCode}
        style={styles.input}
        error={!!errors.code}
      />
      <HelperText type="error" visible={!!errors.code}>
        {errors.code}
      </HelperText>

      <TextInput
        label="Área (hectáreas)"
        value={area}
        onChangeText={setArea}
        keyboardType="numeric"
        style={styles.input}
        error={!!errors.area}
      />
      <HelperText type="error" visible={!!errors.area}>
        {errors.area}
      </HelperText>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Estado del Lote
      </Text>

      <SegmentedButtons
        value={status}
        onValueChange={(value: any) => setStatus(value)}
        buttons={lotStatuses}
        style={styles.segmentedButtons}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Características Físicas
      </Text>

      <TextInput
        label="Tipo de Suelo"
        value={soilType}
        onChangeText={setSoilType}
        style={styles.input}
      />

      <TextInput
        label="Pendiente (%)"
        value={slope}
        onChangeText={setSlope}
        keyboardType="numeric"
        style={styles.input}
        error={!!errors.slope}
      />
      <HelperText type="error" visible={!!errors.slope}>
        {errors.slope}
      </HelperText>

      <Text variant="bodyMedium" style={styles.label}>
        Orientación
      </Text>
      <SegmentedButtons
        value={orientation}
        onValueChange={(value: any) => setOrientation(value)}
        buttons={orientations}
        style={styles.segmentedButtons}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Sistema de Riego
      </Text>

      <SegmentedButtons
        value={irrigationType}
        onValueChange={(value: any) => setIrrigationType(value)}
        buttons={irrigationTypes}
        style={styles.segmentedButtons}
      />

      {irrigationType !== 'none' && (
        <TextInput
          label="Descripción del Sistema de Riego"
          value={irrigationDescription}
          onChangeText={setIrrigationDescription}
          multiline
          numberOfLines={3}
          style={styles.input}
        />
      )}

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Ubicación del Lote
      </Text>

      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text variant="titleMedium" style={styles.placeholderTitle}>
            Definir Coordenadas del Lote
          </Text>
          <Text variant="bodyMedium" style={styles.placeholderText}>
            Mapa no disponible - Use las coordenadas de ejemplo
          </Text>

          <View style={styles.coordinatesInfo}>
            <Text variant="bodyMedium" style={styles.coordinatesCount}>
              Coordenadas: {coordinates.length}
            </Text>
            {coordinates.length > 0 && (
              <Text variant="bodySmall" style={styles.coordinatesPreview}>
                Centro: {coordinates[0].latitude.toFixed(4)}, {coordinates[0].longitude.toFixed(4)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.mapButtons}>
          <Button
            mode={isDrawing ? 'contained' : 'outlined'}
            onPress={() => setIsDrawing(!isDrawing)}
            style={styles.mapButton}
          >
            {isDrawing ? 'Finalizar Dibujo' : 'Modo Dibujo'}
          </Button>

          <Button
            mode="outlined"
            onPress={() => setCoordinates([])}
            style={styles.mapButton}
          >
            Reiniciar
          </Button>
        </View>

        {!!errors.coordinates && (
          <HelperText type="error" visible={!!errors.coordinates}>
            {errors.coordinates}
          </HelperText>
        )}
      </View>

      <TextInput
        label="Notas Adicionales"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

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
    backgroundColor: '#fff',
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  label: {
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  mapContainer: {
    marginBottom: 16,
  },
  map: {
    height: 300,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  mapButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  mapButton: {
    flex: 1,
  },
  buttonContainer: {
    gap: 8,
    marginTop: 24,
    marginBottom: 32,
  },
  button: {
    marginTop: 8,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  placeholderTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  placeholderText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  coordinatesInfo: {
    width: '100%',
    alignItems: 'center',
  },
  coordinatesCount: {
    fontWeight: '500',
  },
  coordinatesPreview: {
    color: '#666',
    marginTop: 4,
  },
});
