import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  TextInput,
  Button,
  useTheme,
  HelperText,
  SegmentedButtons,
  Text,
  Chip,
  List,
  Portal,
  Dialog,
  Checkbox,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { getRealm } from '../services/realm';
import { useImageHandler } from '../hooks/useImageHandler';
import ImageGallery from '../components/ImageGallery';
import type { Treatment } from '../types/models';

interface TreatmentFormProps {
  route: {
    params: {
      lotId: string;
      cropHistoryId?: string;
      treatment?: Treatment;
    };
  };
  navigation: any;
}

const TreatmentForm: React.FC<TreatmentFormProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const existingTreatment = route.params?.treatment;

  // Basic Information
  const [type, setType] = useState<Treatment['type']>(existingTreatment?.type || 'pesticide');
  const [category, setCategory] = useState(existingTreatment?.category || '');
  const [product, setProduct] = useState(existingTreatment?.product || '');
  const [activeIngredient, setActiveIngredient] = useState(existingTreatment?.activeIngredient || '');
  const [concentration, setConcentration] = useState(existingTreatment?.concentration || '');
  const [quantity, setQuantity] = useState(existingTreatment?.quantity.toString() || '');
  const [unit, setUnit] = useState(existingTreatment?.unit || '');
  const [dosagePerHectare, setDosagePerHectare] = useState(
    existingTreatment?.dosagePerHectare.toString() || ''
  );
  const [applicationMethod, setApplicationMethod] = useState<Treatment['applicationMethod']>(
    existingTreatment?.applicationMethod || 'spray'
  );

  // Application Details
  const [applicationDate, setApplicationDate] = useState(
    existingTreatment?.applicationDate || new Date()
  );
  const [nextApplicationDate, setNextApplicationDate] = useState(
    existingTreatment?.nextApplicationDate
  );
  const [applicator, setApplicator] = useState(existingTreatment?.applicator || '');
  const [equipment, setEquipment] = useState(existingTreatment?.equipment || '');
  const [targetProblem, setTargetProblem] = useState(existingTreatment?.targetProblem || '');

  // Weather Conditions
  const [temperature, setTemperature] = useState(
    existingTreatment?.weather.temperature.toString() || ''
  );
  const [humidity, setHumidity] = useState(existingTreatment?.weather.humidity.toString() || '');
  const [windSpeed, setWindSpeed] = useState(existingTreatment?.weather.windSpeed.toString() || '');
  const [windDirection, setWindDirection] = useState<Treatment['weather']['windDirection']>(
    existingTreatment?.weather.windDirection
  );
  const [weatherConditions, setWeatherConditions] = useState<Treatment['weather']['conditions']>(
    existingTreatment?.weather.conditions || 'sunny'
  );
  const [soilMoisture, setSoilMoisture] = useState<Treatment['weather']['soilMoisture']>(
    existingTreatment?.weather.soilMoisture || 'moderate'
  );

  // Effectiveness
  const [effectivenessRating, setEffectivenessRating] = useState<Treatment['effectiveness']['rating']>(
    existingTreatment?.effectiveness?.rating || 3
  );
  const [evaluationDate, setEvaluationDate] = useState(
    existingTreatment?.effectiveness?.evaluationDate || new Date()
  );
  const [observations, setObservations] = useState(
    existingTreatment?.effectiveness?.observations || ''
  );

  // Costs
  const [productCost, setProductCost] = useState(
    existingTreatment?.costs.product.toString() || ''
  );
  const [laborCost, setLaborCost] = useState(existingTreatment?.costs.labor.toString() || '');
  const [equipmentCost, setEquipmentCost] = useState(
    existingTreatment?.costs.equipment.toString() || ''
  );
  const [otherCosts, setOtherCosts] = useState(existingTreatment?.costs.other?.toString() || '');

  // Safety Measures
  const [reentryInterval, setReentryInterval] = useState(
    existingTreatment?.safetyMeasures.reentryInterval.toString() || ''
  );
  const [harvestInterval, setHarvestInterval] = useState(
    existingTreatment?.safetyMeasures.harvestInterval.toString() || ''
  );
  const [protectiveEquipment, setProtectiveEquipment] = useState<string[]>(
    existingTreatment?.safetyMeasures.protectiveEquipment || []
  );

  // Certification
  const [isOrganic, setIsOrganic] = useState(existingTreatment?.certification?.organic || false);
  const [certifier, setCertifier] = useState(existingTreatment?.certification?.certifier || '');
  const [certificationNumber, setCertificationNumber] = useState(
    existingTreatment?.certification?.certificationNumber || ''
  );

  // Status and Notes
  const [status, setStatus] = useState<Treatment['status']>(
    existingTreatment?.status || 'planned'
  );
  const [notes, setNotes] = useState(existingTreatment?.notes || '');

  // Images
  const { images, addImages, removeImage } = useImageHandler({
    maxImages: 10,
    onError: (error) => console.error('Error handling images:', error),
  });

  // Date Pickers
  const [showDatePicker, setShowDatePicker] = useState<{
    show: boolean;
    type: 'application' | 'nextApplication' | 'evaluation';
  }>({ show: false, type: 'application' });

  // Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const treatmentTypes = [
    { label: 'Pesticida', value: 'pesticide' },
    { label: 'Herbicida', value: 'herbicide' },
    { label: 'Fungicida', value: 'fungicide' },
    { label: 'Biológico', value: 'biological' },
    { label: 'Otro', value: 'other' },
  ];

  const applicationMethods = [
    { label: 'Aspersión', value: 'spray' },
    { label: 'Goteo', value: 'drip' },
    { label: 'Granular', value: 'granular' },
    { label: 'Foliar', value: 'foliar' },
    { label: 'Suelo', value: 'soil' },
    { label: 'Otro', value: 'other' },
  ];

  const weatherConditionOptions = [
    { label: 'Soleado', value: 'sunny' },
    { label: 'Nublado', value: 'cloudy' },
    { label: 'Parcialmente Nublado', value: 'partially_cloudy' },
    { label: 'Lluvioso', value: 'rainy' },
    { label: 'Ventoso', value: 'windy' },
  ];

  const soilMoistureOptions = [
    { label: 'Seco', value: 'dry' },
    { label: 'Moderado', value: 'moderate' },
    { label: 'Húmedo', value: 'wet' },
  ];

  const statusOptions = [
    { label: 'Planificado', value: 'planned' },
    { label: 'Aplicado', value: 'applied' },
    { label: 'Evaluado', value: 'evaluated' },
    { label: 'Cancelado', value: 'cancelled' },
  ];

  const protectiveEquipmentOptions = [
    'Máscara',
    'Guantes',
    'Botas',
    'Traje Protector',
    'Gafas',
    'Delantal',
    'Protección Auditiva',
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!product.trim()) {
      newErrors.product = 'El producto es requerido';
    }
    if (!activeIngredient.trim()) {
      newErrors.activeIngredient = 'El ingrediente activo es requerido';
    }
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      newErrors.quantity = 'Ingrese una cantidad válida';
    }
    if (!unit.trim()) {
      newErrors.unit = 'La unidad es requerida';
    }
    if (!dosagePerHectare || isNaN(Number(dosagePerHectare)) || Number(dosagePerHectare) <= 0) {
      newErrors.dosagePerHectare = 'Ingrese una dosis válida por hectárea';
    }
    if (!applicator.trim()) {
      newErrors.applicator = 'El aplicador es requerido';
    }
    if (!equipment.trim()) {
      newErrors.equipment = 'El equipo es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (date: Date | undefined, type: string) => {
    if (!date) return;

    switch (type) {
      case 'application':
        setApplicationDate(date);
        break;
      case 'nextApplication':
        setNextApplicationDate(date);
        break;
      case 'evaluation':
        setEvaluationDate(date);
        break;
    }
    setShowDatePicker({ show: false, type: 'application' });
  };

  const handleSave = async () => {
    if (!validate()) return;

    const realm = getRealm();
    const treatmentData = {
      id: existingTreatment?.id || new Date().getTime().toString(),
      lotId: route.params.lotId,
      cropHistoryId: route.params.cropHistoryId,
      type,
      category,
      product,
      activeIngredient,
      concentration,
      quantity: Number(quantity),
      unit,
      dosagePerHectare: Number(dosagePerHectare),
      applicationMethod,
      applicationDate,
      nextApplicationDate,
      applicator,
      equipment,
      targetProblem,
      weather: {
        temperature: Number(temperature),
        humidity: Number(humidity),
        windSpeed: Number(windSpeed),
        windDirection,
        conditions: weatherConditions,
        soilMoisture,
      },
      effectiveness: status === 'evaluated' ? {
        rating: effectivenessRating,
        evaluationDate,
        observations,
      } : undefined,
      costs: {
        product: Number(productCost),
        labor: Number(laborCost),
        equipment: Number(equipmentCost),
        other: otherCosts ? Number(otherCosts) : undefined,
      },
      safetyMeasures: {
        reentryInterval: Number(reentryInterval),
        harvestInterval: Number(harvestInterval),
        protectiveEquipment,
      },
      certification: isOrganic ? {
        organic: true,
        certifier,
        certificationNumber,
      } : undefined,
      images,
      notes: notes || undefined,
      status,
      createdBy: user!.id,
      organizationId: user!.organization || user!.id,
      createdAt: existingTreatment?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    try {
      realm.write(() => {
        realm.create('Treatment', treatmentData, existingTreatment ? 'modified' : 'all');
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving treatment:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Información Básica
      </Text>

      <SegmentedButtons
        value={type}
        onValueChange={(value: any) => setType(value)}
        buttons={treatmentTypes}
        style={styles.segmentedButtons}
      />

      <TextInput
        label="Categoría"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <TextInput
        label="Producto"
        value={product}
        onChangeText={setProduct}
        style={styles.input}
        error={!!errors.product}
      />
      <HelperText type="error" visible={!!errors.product}>
        {errors.product}
      </HelperText>

      <TextInput
        label="Ingrediente Activo"
        value={activeIngredient}
        onChangeText={setActiveIngredient}
        style={styles.input}
        error={!!errors.activeIngredient}
      />
      <HelperText type="error" visible={!!errors.activeIngredient}>
        {errors.activeIngredient}
      </HelperText>

      <TextInput
        label="Concentración"
        value={concentration}
        onChangeText={setConcentration}
        style={styles.input}
      />

      <View style={styles.row}>
        <View style={styles.flex2}>
          <TextInput
            label="Cantidad"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.input}
            error={!!errors.quantity}
          />
          <HelperText type="error" visible={!!errors.quantity}>
            {errors.quantity}
          </HelperText>
        </View>

        <View style={styles.flex1}>
          <TextInput
            label="Unidad"
            value={unit}
            onChangeText={setUnit}
            style={styles.input}
            error={!!errors.unit}
          />
          <HelperText type="error" visible={!!errors.unit}>
            {errors.unit}
          </HelperText>
        </View>
      </View>

      <TextInput
        label="Dosis por Hectárea"
        value={dosagePerHectare}
        onChangeText={setDosagePerHectare}
        keyboardType="numeric"
        style={styles.input}
        error={!!errors.dosagePerHectare}
      />
      <HelperText type="error" visible={!!errors.dosagePerHectare}>
        {errors.dosagePerHectare}
      </HelperText>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Método de Aplicación
      </Text>

      <SegmentedButtons
        value={applicationMethod}
        onValueChange={(value: any) => setApplicationMethod(value)}
        buttons={applicationMethods}
        style={styles.segmentedButtons}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Detalles de Aplicación
      </Text>

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker({ show: true, type: 'application' })}
        style={styles.dateButton}
      >
        Fecha de Aplicación: {applicationDate.toLocaleDateString()}
      </Button>

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker({ show: true, type: 'nextApplication' })}
        style={styles.dateButton}
      >
        Próxima Aplicación: {nextApplicationDate?.toLocaleDateString() || 'No establecida'}
      </Button>

      <TextInput
        label="Aplicador"
        value={applicator}
        onChangeText={setApplicator}
        style={styles.input}
        error={!!errors.applicator}
      />
      <HelperText type="error" visible={!!errors.applicator}>
        {errors.applicator}
      </HelperText>

      <TextInput
        label="Equipo Utilizado"
        value={equipment}
        onChangeText={setEquipment}
        style={styles.input}
        error={!!errors.equipment}
      />
      <HelperText type="error" visible={!!errors.equipment}>
        {errors.equipment}
      </HelperText>

      <TextInput
        label="Problema Objetivo"
        value={targetProblem}
        onChangeText={setTargetProblem}
        style={styles.input}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Condiciones Climáticas
      </Text>

      <View style={styles.row}>
        <View style={styles.flex1}>
          <TextInput
            label="Temperatura (°C)"
            value={temperature}
            onChangeText={setTemperature}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.flex1}>
          <TextInput
            label="Humedad (%)"
            value={humidity}
            onChangeText={setHumidity}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.flex1}>
          <TextInput
            label="Viento (km/h)"
            value={windSpeed}
            onChangeText={setWindSpeed}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      </View>

      <Text variant="bodyMedium" style={styles.label}>
        Dirección del Viento
      </Text>
      <View style={styles.chipContainer}>
        {['N', 'S', 'E', 'W', 'NE', 'NW', 'SE', 'SW'].map((direction) => (
          <Chip
            key={direction}
            selected={windDirection === direction}
            onPress={() => setWindDirection(direction as any)}
            style={styles.chip}
          >
            {direction}
          </Chip>
        ))}
      </View>

      <Text variant="bodyMedium" style={styles.label}>
        Condiciones del Tiempo
      </Text>
      <SegmentedButtons
        value={weatherConditions}
        onValueChange={(value: any) => setWeatherConditions(value)}
        buttons={weatherConditionOptions}
        style={styles.segmentedButtons}
      />

      <Text variant="bodyMedium" style={styles.label}>
        Humedad del Suelo
      </Text>
      <SegmentedButtons
        value={soilMoisture || 'moderate'}
        onValueChange={(value: any) => setSoilMoisture(value)}
        buttons={soilMoistureOptions}
        style={styles.segmentedButtons}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Costos
      </Text>

      <TextInput
        label="Costo del Producto"
        value={productCost}
        onChangeText={setProductCost}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Costo de Mano de Obra"
        value={laborCost}
        onChangeText={setLaborCost}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Costo de Equipamiento"
        value={equipmentCost}
        onChangeText={setEquipmentCost}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Otros Costos"
        value={otherCosts}
        onChangeText={setOtherCosts}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Medidas de Seguridad
      </Text>

      <TextInput
        label="Intervalo de Reingreso (horas)"
        value={reentryInterval}
        onChangeText={setReentryInterval}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Intervalo de Cosecha (días)"
        value={harvestInterval}
        onChangeText={setHarvestInterval}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text variant="bodyMedium" style={styles.label}>
        Equipo de Protección
      </Text>
      <View style={styles.checkboxContainer}>
        {protectiveEquipmentOptions.map((equipment) => (
          <Checkbox.Item
            key={equipment}
            label={equipment}
            status={protectiveEquipment.includes(equipment) ? 'checked' : 'unchecked'}
            onPress={() => {
              if (protectiveEquipment.includes(equipment)) {
                setProtectiveEquipment(protectiveEquipment.filter((e) => e !== equipment));
              } else {
                setProtectiveEquipment([...protectiveEquipment, equipment]);
              }
            }}
          />
        ))}
      </View>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Certificación
      </Text>

      <Checkbox.Item
        label="Producto Orgánico"
        status={isOrganic ? 'checked' : 'unchecked'}
        onPress={() => setIsOrganic(!isOrganic)}
      />

      {isOrganic && (
        <>
          <TextInput
            label="Certificador"
            value={certifier}
            onChangeText={setCertifier}
            style={styles.input}
          />

          <TextInput
            label="Número de Certificación"
            value={certificationNumber}
            onChangeText={setCertificationNumber}
            style={styles.input}
          />
        </>
      )}

      {status === 'evaluated' && (
        <>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Evaluación de Efectividad
          </Text>

          <Text variant="bodyMedium" style={styles.label}>
            Calificación
          </Text>
          <SegmentedButtons
            value={effectivenessRating.toString()}
            onValueChange={(value: any) => setEffectivenessRating(Number(value))}
            buttons={[1, 2, 3, 4, 5].map((rating) => ({
              value: rating.toString(),
              label: rating.toString(),
            }))}
            style={styles.segmentedButtons}
          />

          <Button
            mode="outlined"
            onPress={() => setShowDatePicker({ show: true, type: 'evaluation' })}
            style={styles.dateButton}
          >
            Fecha de Evaluación: {evaluationDate.toLocaleDateString()}
          </Button>

          <TextInput
            label="Observaciones"
            value={observations}
            onChangeText={setObservations}
            multiline
            numberOfLines={3}
            style={styles.input}
          />
        </>
      )}

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Estado
      </Text>

      <SegmentedButtons
        value={status}
        onValueChange={(value: any) => setStatus(value)}
        buttons={statusOptions}
        style={styles.segmentedButtons}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Imágenes
      </Text>

      <ImageGallery
        images={images}
        onAddImage={addImages}
        onRemoveImage={removeImage}
        title="Imágenes del Tratamiento"
      />

      <TextInput
        label="Notas Adicionales"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      {showDatePicker.show && (
        <DateTimePicker
          value={
            showDatePicker.type === 'application'
              ? applicationDate
              : showDatePicker.type === 'nextApplication'
              ? nextApplicationDate || new Date()
              : evaluationDate
          }
          mode="date"
          onChange={(event, date) => handleDateChange(date, showDatePicker.type)}
        />
      )}

      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSave} style={styles.button}>
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
  dateButton: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  checkboxContainer: {
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 8,
    marginTop: 24,
    marginBottom: 32,
  },
  button: {
    marginTop: 8,
  },
});

export default TreatmentForm;