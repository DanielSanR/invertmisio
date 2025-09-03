import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Platform } from 'react-native';
import {
  TextInput,
  Button,
  useTheme,
  HelperText,
  SegmentedButtons,
  Text,
  List,
  IconButton,
  Portal,
  Dialog,
  Divider,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';
import { getRealm } from '../services/realm';
import { useImageHandler } from '../hooks/useImageHandler';
import ImageGallery from '../components/ImageGallery';
import type { CropHistory } from '../types/models';

interface CropHistoryFormProps {
  route: {
    params: {
      lotId: string;
      cropHistory?: CropHistory;
    };
  };
  navigation: any;
}

const CropHistoryForm: React.FC<CropHistoryFormProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const existingCrop = route.params?.cropHistory;

  // Basic Information
  const [cropType, setCropType] = useState(existingCrop?.cropType || '');
  const [variety, setVariety] = useState(existingCrop?.variety || '');
  const [season, setSeason] = useState(existingCrop?.season || '');
  const [status, setStatus] = useState<CropHistory['status']>(existingCrop?.status || 'planned');

  // Dates
  const [startDate, setStartDate] = useState(existingCrop?.startDate || new Date());
  const [plantingDate, setPlantingDate] = useState(existingCrop?.plantingDate || new Date());
  const [expectedHarvestDate, setExpectedHarvestDate] = useState(
    existingCrop?.expectedHarvestDate || new Date()
  );
  const [actualHarvestDate, setActualHarvestDate] = useState(existingCrop?.actualHarvestDate);
  const [showDatePicker, setShowDatePicker] = useState<{
    show: boolean;
    type: 'start' | 'planting' | 'expectedHarvest' | 'actualHarvest';
  }>({ show: false, type: 'start' });

  // Density
  const [plantsPerHectare, setPlantsPerHectare] = useState(
    existingCrop?.density.plantsPerHectare.toString() || ''
  );
  const [rowSpacing, setRowSpacing] = useState(
    existingCrop?.density.rowSpacing.toString() || ''
  );
  const [plantSpacing, setPlantSpacing] = useState(
    existingCrop?.density.plantSpacing.toString() || ''
  );

  // Yield
  const [yieldAmount, setYieldAmount] = useState(
    existingCrop?.yield?.amount.toString() || ''
  );
  const [yieldUnit, setYieldUnit] = useState(existingCrop?.yield?.unit || '');
  const [yieldQuality, setYieldQuality] = useState<
    'excellent' | 'good' | 'fair' | 'poor' | undefined
  >(existingCrop?.yield?.quality);

  // Fertilization
  const [fertilizations, setFertilizations] = useState(existingCrop?.fertilization || []);
  const [showFertilizationDialog, setShowFertilizationDialog] = useState(false);
  const [currentFertilization, setCurrentFertilization] = useState<{
    date: Date;
    product: string;
    amount: string;
    unit: string;
    method: string;
  }>({
    date: new Date(),
    product: '',
    amount: '',
    unit: '',
    method: '',
  });

  // Irrigation
  const [irrigations, setIrrigations] = useState(existingCrop?.irrigation || []);
  const [showIrrigationDialog, setShowIrrigationDialog] = useState(false);
  const [currentIrrigation, setCurrentIrrigation] = useState<{
    date: Date;
    duration: string;
    amount: string;
    type: 'drip' | 'sprinkler' | 'flood';
  }>({
    date: new Date(),
    duration: '',
    amount: '',
    type: 'drip',
  });

  // Weather
  const [averageTemperature, setAverageTemperature] = useState(
    existingCrop?.weather.averageTemperature?.toString() || ''
  );
  const [totalRainfall, setTotalRainfall] = useState(
    existingCrop?.weather.totalRainfall?.toString() || ''
  );
  const [extremeEvents, setExtremeEvents] = useState(
    existingCrop?.weather.extremeEvents || []
  );

  // Costs
  const [costs, setCosts] = useState({
    seeds: existingCrop?.costs.seeds?.toString() || '',
    fertilizers: existingCrop?.costs.fertilizers?.toString() || '',
    pesticides: existingCrop?.costs.pesticides?.toString() || '',
    labor: existingCrop?.costs.labor?.toString() || '',
    irrigation: existingCrop?.costs.irrigation?.toString() || '',
    other: existingCrop?.costs.other?.toString() || '',
  });

  // Additional Information
  const [failureReason, setFailureReason] = useState(existingCrop?.failureReason || '');
  const [notes, setNotes] = useState(existingCrop?.notes || '');

  // Images
  const { images, addImages, removeImage } = useImageHandler({
    maxImages: 10,
    onError: (error) => console.error('Error handling images:', error),
  });

  // Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const cropStatuses = [
    { label: 'Planificado', value: 'planned' },
    { label: 'En Progreso', value: 'in_progress' },
    { label: 'Cosechado', value: 'harvested' },
    { label: 'Fallido', value: 'failed' },
    { label: 'Completado', value: 'completed' },
  ];

  const yieldQualities = [
    { label: 'Excelente', value: 'excellent' },
    { label: 'Bueno', value: 'good' },
    { label: 'Regular', value: 'fair' },
    { label: 'Pobre', value: 'poor' },
  ];

  const irrigationTypes = [
    { label: 'Goteo', value: 'drip' },
    { label: 'Aspersión', value: 'sprinkler' },
    { label: 'Inundación', value: 'flood' },
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!cropType.trim()) {
      newErrors.cropType = 'El tipo de cultivo es requerido';
    }
    if (!variety.trim()) {
      newErrors.variety = 'La variedad es requerida';
    }
    if (!season.trim()) {
      newErrors.season = 'La temporada es requerida';
    }
    if (!plantsPerHectare || isNaN(Number(plantsPerHectare)) || Number(plantsPerHectare) <= 0) {
      newErrors.plantsPerHectare = 'Ingrese un número válido de plantas por hectárea';
    }
    if (!rowSpacing || isNaN(Number(rowSpacing)) || Number(rowSpacing) <= 0) {
      newErrors.rowSpacing = 'Ingrese una distancia válida entre hileras';
    }
    if (!plantSpacing || isNaN(Number(plantSpacing)) || Number(plantSpacing) <= 0) {
      newErrors.plantSpacing = 'Ingrese una distancia válida entre plantas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (date: Date | undefined, type: string) => {
    if (!date) return;

    switch (type) {
      case 'start':
        setStartDate(date);
        break;
      case 'planting':
        setPlantingDate(date);
        break;
      case 'expectedHarvest':
        setExpectedHarvestDate(date);
        break;
      case 'actualHarvest':
        setActualHarvestDate(date);
        break;
    }
    setShowDatePicker({ show: false, type: 'start' });
  };

  const handleAddFertilization = () => {
    if (
      !currentFertilization.product ||
      !currentFertilization.amount ||
      !currentFertilization.unit ||
      !currentFertilization.method
    )
      return;

    setFertilizations([
      ...fertilizations,
      {
        ...currentFertilization,
        amount: Number(currentFertilization.amount),
      },
    ]);
    setShowFertilizationDialog(false);
    setCurrentFertilization({
      date: new Date(),
      product: '',
      amount: '',
      unit: '',
      method: '',
    });
  };

  const handleAddIrrigation = () => {
    if (!currentIrrigation.duration || !currentIrrigation.type) return;

    setIrrigations([
      ...irrigations,
      {
        ...currentIrrigation,
        duration: Number(currentIrrigation.duration),
        amount: currentIrrigation.amount ? Number(currentIrrigation.amount) : undefined,
      },
    ]);
    setShowIrrigationDialog(false);
    setCurrentIrrigation({
      date: new Date(),
      duration: '',
      amount: '',
      type: 'drip',
    });
  };

  const handleSave = async () => {
    if (!validate()) return;

    const realm = getRealm();
    const cropData = {
      id: existingCrop?.id || new Date().getTime().toString(),
      lotId: route.params.lotId,
      cropType,
      variety,
      season,
      startDate,
      plantingDate,
      expectedHarvestDate,
      actualHarvestDate,
      endDate: status === 'completed' || status === 'harvested' ? new Date() : undefined,
      yield: yieldAmount
        ? {
            amount: Number(yieldAmount),
            unit: yieldUnit,
            quality: yieldQuality,
          }
        : undefined,
      density: {
        plantsPerHectare: Number(plantsPerHectare),
        rowSpacing: Number(rowSpacing),
        plantSpacing: Number(plantSpacing),
      },
      fertilization: fertilizations,
      irrigation: irrigations,
      weather: {
        averageTemperature: averageTemperature ? Number(averageTemperature) : undefined,
        totalRainfall: totalRainfall ? Number(totalRainfall) : undefined,
        extremeEvents,
      },
      costs: {
        seeds: costs.seeds ? Number(costs.seeds) : undefined,
        fertilizers: costs.fertilizers ? Number(costs.fertilizers) : undefined,
        pesticides: costs.pesticides ? Number(costs.pesticides) : undefined,
        labor: costs.labor ? Number(costs.labor) : undefined,
        irrigation: costs.irrigation ? Number(costs.irrigation) : undefined,
        other: costs.other ? Number(costs.other) : undefined,
      },
      status,
      failureReason: status === 'failed' ? failureReason : undefined,
      notes: notes || undefined,
      images,
      createdBy: user!.id,
      organizationId: user!.organization || user!.id,
      createdAt: existingCrop?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    try {
      realm.write(() => {
        realm.create('CropHistory', cropData, existingCrop ? 'modified' : 'all');
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving crop history:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Información Básica
      </Text>

      <TextInput
        label="Tipo de Cultivo"
        value={cropType}
        onChangeText={setCropType}
        style={styles.input}
        error={!!errors.cropType}
      />
      <HelperText type="error" visible={!!errors.cropType}>
        {errors.cropType}
      </HelperText>

      <TextInput
        label="Variedad"
        value={variety}
        onChangeText={setVariety}
        style={styles.input}
        error={!!errors.variety}
      />
      <HelperText type="error" visible={!!errors.variety}>
        {errors.variety}
      </HelperText>

      <TextInput
        label="Temporada"
        value={season}
        onChangeText={setSeason}
        style={styles.input}
        error={!!errors.season}
      />
      <HelperText type="error" visible={!!errors.season}>
        {errors.season}
      </HelperText>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Estado del Cultivo
      </Text>

      <SegmentedButtons
        value={status}
        onValueChange={(value: any) => setStatus(value)}
        buttons={cropStatuses}
        style={styles.segmentedButtons}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Fechas Importantes
      </Text>

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker({ show: true, type: 'start' })}
        style={styles.dateButton}
      >
        Fecha de Inicio: {startDate.toLocaleDateString()}
      </Button>

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker({ show: true, type: 'planting' })}
        style={styles.dateButton}
      >
        Fecha de Siembra: {plantingDate.toLocaleDateString()}
      </Button>

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker({ show: true, type: 'expectedHarvest' })}
        style={styles.dateButton}
      >
        Cosecha Esperada: {expectedHarvestDate.toLocaleDateString()}
      </Button>

      {(status === 'harvested' || status === 'completed') && (
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker({ show: true, type: 'actualHarvest' })}
          style={styles.dateButton}
        >
          Cosecha Real: {actualHarvestDate?.toLocaleDateString() || 'No establecida'}
        </Button>
      )}

      {showDatePicker.show && (
        <DateTimePicker
          value={
            showDatePicker.type === 'start'
              ? startDate
              : showDatePicker.type === 'planting'
              ? plantingDate
              : showDatePicker.type === 'expectedHarvest'
              ? expectedHarvestDate
              : actualHarvestDate || new Date()
          }
          mode="date"
          onChange={(event, date) => handleDateChange(date, showDatePicker.type)}
        />
      )}

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Densidad de Siembra
      </Text>

      <TextInput
        label="Plantas por Hectárea"
        value={plantsPerHectare}
        onChangeText={setPlantsPerHectare}
        keyboardType="numeric"
        style={styles.input}
        error={!!errors.plantsPerHectare}
      />
      <HelperText type="error" visible={!!errors.plantsPerHectare}>
        {errors.plantsPerHectare}
      </HelperText>

      <View style={styles.row}>
        <View style={styles.flex1}>
          <TextInput
            label="Distancia entre Hileras (m)"
            value={rowSpacing}
            onChangeText={setRowSpacing}
            keyboardType="numeric"
            style={styles.input}
            error={!!errors.rowSpacing}
          />
          <HelperText type="error" visible={!!errors.rowSpacing}>
            {errors.rowSpacing}
          </HelperText>
        </View>

        <View style={styles.flex1}>
          <TextInput
            label="Distancia entre Plantas (m)"
            value={plantSpacing}
            onChangeText={setPlantSpacing}
            keyboardType="numeric"
            style={styles.input}
            error={!!errors.plantSpacing}
          />
          <HelperText type="error" visible={!!errors.plantSpacing}>
            {errors.plantSpacing}
          </HelperText>
        </View>
      </View>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Fertilización
      </Text>

      {fertilizations.map((fert, index) => (
        <List.Item
          key={index}
          title={fert.product}
          description={`${fert.amount} ${fert.unit} - ${fert.method}`}
          left={(props) => <List.Icon {...props} icon="fertilizer" />}
          right={(props) => (
            <IconButton
              {...props}
              icon="delete"
              onPress={() => {
                const newFertilizations = [...fertilizations];
                newFertilizations.splice(index, 1);
                setFertilizations(newFertilizations);
              }}
            />
          )}
        />
      ))}

      <Button
        mode="outlined"
        onPress={() => setShowFertilizationDialog(true)}
        style={styles.addButton}
      >
        Agregar Fertilización
      </Button>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Riego
      </Text>

      {irrigations.map((irr, index) => (
        <List.Item
          key={index}
          title={`${irr.type === 'drip' ? 'Goteo' : irr.type === 'sprinkler' ? 'Aspersión' : 'Inundación'}`}
          description={`${irr.duration} horas${irr.amount ? ` - ${irr.amount} mm` : ''}`}
          left={(props) => <List.Icon {...props} icon="water" />}
          right={(props) => (
            <IconButton
              {...props}
              icon="delete"
              onPress={() => {
                const newIrrigations = [...irrigations];
                newIrrigations.splice(index, 1);
                setIrrigations(newIrrigations);
              }}
            />
          )}
        />
      ))}

      <Button
        mode="outlined"
        onPress={() => setShowIrrigationDialog(true)}
        style={styles.addButton}
      >
        Agregar Riego
      </Button>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Condiciones Climáticas
      </Text>

      <TextInput
        label="Temperatura Promedio (°C)"
        value={averageTemperature}
        onChangeText={setAverageTemperature}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Precipitación Total (mm)"
        value={totalRainfall}
        onChangeText={setTotalRainfall}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Costos
      </Text>

      <TextInput
        label="Semillas"
        value={costs.seeds}
        onChangeText={(value) => setCosts({ ...costs, seeds: value })}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Fertilizantes"
        value={costs.fertilizers}
        onChangeText={(value) => setCosts({ ...costs, fertilizers: value })}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Pesticidas"
        value={costs.pesticides}
        onChangeText={(value) => setCosts({ ...costs, pesticides: value })}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Mano de Obra"
        value={costs.labor}
        onChangeText={(value) => setCosts({ ...costs, labor: value })}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Riego"
        value={costs.irrigation}
        onChangeText={(value) => setCosts({ ...costs, irrigation: value })}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Otros Costos"
        value={costs.other}
        onChangeText={(value) => setCosts({ ...costs, other: value })}
        keyboardType="numeric"
        style={styles.input}
      />

      {status === 'harvested' && (
        <>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Rendimiento
          </Text>

          <View style={styles.row}>
            <View style={styles.flex2}>
              <TextInput
                label="Cantidad"
                value={yieldAmount}
                onChangeText={setYieldAmount}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            <View style={styles.flex1}>
              <TextInput
                label="Unidad"
                value={yieldUnit}
                onChangeText={setYieldUnit}
                style={styles.input}
              />
            </View>
          </View>

          <Text variant="bodyMedium" style={styles.label}>
            Calidad
          </Text>
          <SegmentedButtons
            value={yieldQuality || ''}
            onValueChange={(value: any) => setYieldQuality(value)}
            buttons={yieldQualities}
            style={styles.segmentedButtons}
          />
        </>
      )}

      {status === 'failed' && (
        <TextInput
          label="Razón del Fracaso"
          value={failureReason}
          onChangeText={setFailureReason}
          multiline
          numberOfLines={3}
          style={styles.input}
        />
      )}

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Imágenes
      </Text>

      <ImageGallery
        images={images}
        onAddImage={addImages}
        onRemoveImage={removeImage}
        title="Imágenes del Cultivo"
      />

      <TextInput
        label="Notas Adicionales"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

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

      {/* Fertilization Dialog */}
      <Portal>
        <Dialog
          visible={showFertilizationDialog}
          onDismiss={() => setShowFertilizationDialog(false)}
        >
          <Dialog.Title>Agregar Fertilización</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Producto"
              value={currentFertilization.product}
              onChangeText={(text) =>
                setCurrentFertilization({ ...currentFertilization, product: text })
              }
              style={styles.input}
            />

            <View style={styles.row}>
              <View style={styles.flex2}>
                <TextInput
                  label="Cantidad"
                  value={currentFertilization.amount}
                  onChangeText={(text) =>
                    setCurrentFertilization({ ...currentFertilization, amount: text })
                  }
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>

              <View style={styles.flex1}>
                <TextInput
                  label="Unidad"
                  value={currentFertilization.unit}
                  onChangeText={(text) =>
                    setCurrentFertilization({ ...currentFertilization, unit: text })
                  }
                  style={styles.input}
                />
              </View>
            </View>

            <TextInput
              label="Método"
              value={currentFertilization.method}
              onChangeText={(text) =>
                setCurrentFertilization({ ...currentFertilization, method: text })
              }
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowFertilizationDialog(false)}>Cancelar</Button>
            <Button onPress={handleAddFertilization}>Agregar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Irrigation Dialog */}
      <Portal>
        <Dialog
          visible={showIrrigationDialog}
          onDismiss={() => setShowIrrigationDialog(false)}
        >
          <Dialog.Title>Agregar Riego</Dialog.Title>
          <Dialog.Content>
            <SegmentedButtons
              value={currentIrrigation.type}
              onValueChange={(value: any) =>
                setCurrentIrrigation({ ...currentIrrigation, type: value })
              }
              buttons={irrigationTypes}
              style={styles.segmentedButtons}
            />

            <TextInput
              label="Duración (horas)"
              value={currentIrrigation.duration}
              onChangeText={(text) =>
                setCurrentIrrigation({ ...currentIrrigation, duration: text })
              }
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              label="Cantidad (mm)"
              value={currentIrrigation.amount}
              onChangeText={(text) =>
                setCurrentIrrigation({ ...currentIrrigation, amount: text })
              }
              keyboardType="numeric"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowIrrigationDialog(false)}>Cancelar</Button>
            <Button onPress={handleAddIrrigation}>Agregar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  addButton: {
    marginTop: 8,
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

export default CropHistoryForm;