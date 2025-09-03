import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  TextInput,
  Button,
  useTheme,
  HelperText,
  SegmentedButtons,
  Text,
  Divider,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';
import { getRealm } from '../../services/realm';
import { useImageHandler } from '../../hooks/useImageHandler';
import ListManager from './ListManager';
import ImageUploader from './ImageUploader';
import {
  HealthRecordFormProps,
  issueTypes,
  severityLevels,
  stages,
  distributions,
  locations,
  soilMoistureOptions,
  diagnosisMethods,
  confidenceLevels,
  qualityImpacts,
  monitoringFrequencies,
  statusOptions,
} from './types';
import { styles } from './styles';

const HealthRecordForm: React.FC<HealthRecordFormProps> = ({ route, navigation }) => {
  // ... State declarations from previous implementation ...

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'El nombre del problema es requerido';
    }
    if (!description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!symptoms.length) {
      newErrors.symptoms = 'Ingrese al menos un síntoma';
    }
    if (!affectedSize || isNaN(Number(affectedSize)) || Number(affectedSize) <= 0) {
      newErrors.affectedSize = 'Ingrese un tamaño válido del área afectada';
    }
    if (!affectedPercentage || isNaN(Number(affectedPercentage)) || 
        Number(affectedPercentage) < 0 || Number(affectedPercentage) > 100) {
      newErrors.affectedPercentage = 'Ingrese un porcentaje válido (0-100)';
    }
    if (!cropStage.trim()) {
      newErrors.cropStage = 'La etapa del cultivo es requerida';
    }
    if (!monitoringMethod.trim()) {
      newErrors.monitoringMethod = 'El método de monitoreo es requerido';
    }
    if (!responsiblePerson.trim()) {
      newErrors.responsiblePerson = 'El responsable del monitoreo es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (date: Date | undefined, type: string) => {
    if (!date) return;

    switch (type) {
      case 'date':
        setDate(date);
        break;
      case 'diagnosis':
        setDiagnosisDate(date);
        break;
      case 'treatment':
        setTreatmentDate(date);
        break;
      case 'followUp':
        setFollowUpDate(date);
        break;
      case 'nextInspection':
        setNextInspectionDate(date);
        break;
      case 'sample':
        setSampleDate(date);
        break;
      case 'resolution':
        setResolutionDate(date);
        break;
    }
    setShowDatePicker({ show: false, type: 'date' });
  };

  const handleSave = async () => {
    if (!validate()) return;

    const realm = getRealm();
    const healthData = {
      id: existingRecord?.id || new Date().getTime().toString(),
      lotId: route.params.lotId,
      cropHistoryId: route.params.cropHistoryId,
      date,
      type,
      category,
      name,
      scientificName: scientificName || undefined,
      severity,
      stage,
      description,
      symptoms,
      affectedArea: {
        size: Number(affectedSize),
        percentage: Number(affectedPercentage),
        distribution,
        location,
      },
      cropStage,
      environmentalConditions: {
        temperature: Number(temperature),
        humidity: Number(humidity),
        rainfall: rainfall ? Number(rainfall) : undefined,
        soilMoisture,
        soilCondition: soilCondition || undefined,
      },
      diagnosis: {
        confirmedBy: confirmedBy || undefined,
        method: diagnosisMethod,
        date: diagnosisDate,
        confidence,
      },
      treatment: {
        recommended: recommendedTreatments,
        applied: appliedTreatments,
        effectiveness: treatmentEffectiveness,
        treatmentDate,
        followUpDate,
      },
      prevention: {
        recommendations,
        implementedMeasures,
      },
      impact: {
        yieldLoss: yieldLoss ? Number(yieldLoss) : undefined,
        qualityImpact,
        economicLoss: economicLoss ? Number(economicLoss) : undefined,
      },
      monitoring: {
        frequency: monitoringFrequency,
        method: monitoringMethod,
        responsiblePerson,
        nextInspectionDate,
      },
      laboratoryAnalysis: hasLabAnalysis ? {
        sampleDate,
        laboratory,
        results: labResults,
        recommendations: labRecommendations,
      } : undefined,
      images: images.map((image, index) => ({
        uri: image,
        type: 'symptom',
        date: new Date(),
      })),
      status,
      resolution: hasResolution ? {
        date: resolutionDate,
        effectiveness: resolutionEffectiveness,
        notes: resolutionNotes,
      } : undefined,
      notes: notes || undefined,
      createdBy: user!.id,
      organizationId: user!.organization || user!.id,
      createdAt: existingRecord?.createdAt || new Date(),
      updatedAt: new Date(),
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
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Información Básica
      </Text>

      <Button
        mode="outlined"
        onPress={() => setShowDatePicker({ show: true, type: 'date' })}
        style={styles.dateButton}
      >
        Fecha: {date.toLocaleDateString()}
      </Button>

      <Text variant="bodyMedium" style={styles.label}>
        Tipo de Problema
      </Text>
      <SegmentedButtons
        value={type}
        onValueChange={(value: any) => setType(value)}
        buttons={issueTypes}
        style={styles.segmentedButtons}
      />

      <TextInput
        label="Categoría"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <TextInput
        label="Nombre del Problema"
        value={name}
        onChangeText={setName}
        style={styles.input}
        error={!!errors.name}
      />
      <HelperText type="error" visible={!!errors.name}>
        {errors.name}
      </HelperText>

      <TextInput
        label="Nombre Científico (opcional)"
        value={scientificName}
        onChangeText={setScientificName}
        style={styles.input}
      />

      <Text variant="bodyMedium" style={styles.label}>
        Severidad
      </Text>
      <SegmentedButtons
        value={severity}
        onValueChange={(value: any) => setSeverity(value)}
        buttons={severityLevels}
        style={styles.segmentedButtons}
      />

      <Text variant="bodyMedium" style={styles.label}>
        Etapa
      </Text>
      <SegmentedButtons
        value={stage}
        onValueChange={(value: any) => setStage(value)}
        buttons={stages}
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

      <ListManager
        title="Síntomas"
        items={symptoms}
        onAddItem={(item) => setSymptoms([...symptoms, item])}
        onRemoveItem={(index) => {
          const newSymptoms = [...symptoms];
          newSymptoms.splice(index, 1);
          setSymptoms(newSymptoms);
        }}
        placeholder="Agregar síntoma"
      />
      {!!errors.symptoms && (
        <Text style={styles.errorText}>{errors.symptoms}</Text>
      )}

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Área Afectada
      </Text>

      <View style={styles.row}>
        <View style={styles.flex1}>
          <TextInput
            label="Tamaño (ha)"
            value={affectedSize}
            onChangeText={setAffectedSize}
            keyboardType="numeric"
            style={styles.input}
            error={!!errors.affectedSize}
          />
          <HelperText type="error" visible={!!errors.affectedSize}>
            {errors.affectedSize}
          </HelperText>
        </View>

        <View style={styles.flex1}>
          <TextInput
            label="Porcentaje (%)"
            value={affectedPercentage}
            onChangeText={setAffectedPercentage}
            keyboardType="numeric"
            style={styles.input}
            error={!!errors.affectedPercentage}
          />
          <HelperText type="error" visible={!!errors.affectedPercentage}>
            {errors.affectedPercentage}
          </HelperText>
        </View>
      </View>

      <Text variant="bodyMedium" style={styles.label}>
        Distribución
      </Text>
      <SegmentedButtons
        value={distribution}
        onValueChange={(value: any) => setDistribution(value)}
        buttons={distributions}
        style={styles.segmentedButtons}
      />

      <Text variant="bodyMedium" style={styles.label}>
        Ubicación
      </Text>
      <SegmentedButtons
        value={location}
        onValueChange={(value: any) => setLocation(value)}
        buttons={locations}
        style={styles.segmentedButtons}
      />

      <TextInput
        label="Etapa del Cultivo"
        value={cropStage}
        onChangeText={setCropStage}
        style={styles.input}
        error={!!errors.cropStage}
      />
      <HelperText type="error" visible={!!errors.cropStage}>
        {errors.cropStage}
      </HelperText>

      <Divider style={styles.divider} />

      {/* ... Continue with the rest of the form sections ... */}

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

      {showDatePicker.show && (
        <DateTimePicker
          value={
            showDatePicker.type === 'date'
              ? date
              : showDatePicker.type === 'diagnosis'
              ? diagnosisDate
              : showDatePicker.type === 'treatment'
              ? treatmentDate
              : showDatePicker.type === 'followUp'
              ? followUpDate
              : showDatePicker.type === 'nextInspection'
              ? nextInspectionDate
              : showDatePicker.type === 'sample'
              ? sampleDate
              : resolutionDate
          }
          mode="date"
          onChange={(event, selectedDate) =>
            handleDateChange(selectedDate, showDatePicker.type)
          }
        />
      )}
    </ScrollView>
  );
};

export default HealthRecordForm;
