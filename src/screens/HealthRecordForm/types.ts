import { HealthRecord } from '../../types/models';

export interface HealthRecordFormProps {
  route: {
    params: {
      lotId: string;
      cropHistoryId?: string;
      healthRecord?: HealthRecord;
    };
  };
  navigation: any;
}

export const issueTypes = [
  { label: 'Plaga', value: 'pest' },
  { label: 'Enfermedad', value: 'disease' },
  { label: 'Deficiencia', value: 'deficiency' },
  { label: 'Maleza', value: 'weed' },
  { label: 'Estrés', value: 'stress' },
  { label: 'Otro', value: 'other' },
];

export const severityLevels = [
  { label: 'Bajo', value: 'low' },
  { label: 'Medio', value: 'medium' },
  { label: 'Alto', value: 'high' },
  { label: 'Crítico', value: 'critical' },
];

export const stages = [
  { label: 'Temprano', value: 'early' },
  { label: 'Desarrollando', value: 'developing' },
  { label: 'Avanzado', value: 'advanced' },
  { label: 'Controlado', value: 'controlled' },
];

export const distributions = [
  { label: 'Aislado', value: 'isolated' },
  { label: 'Disperso', value: 'scattered' },
  { label: 'Generalizado', value: 'widespread' },
  { label: 'Uniforme', value: 'uniform' },
];

export const locations = [
  { label: 'Borde', value: 'edge' },
  { label: 'Centro', value: 'center' },
  { label: 'Aleatorio', value: 'random' },
  { label: 'Patrón', value: 'pattern' },
];

export const soilMoistureOptions = [
  { label: 'Seco', value: 'dry' },
  { label: 'Moderado', value: 'moderate' },
  { label: 'Húmedo', value: 'wet' },
];

export const diagnosisMethods = [
  { label: 'Visual', value: 'visual' },
  { label: 'Laboratorio', value: 'laboratory' },
  { label: 'Experto', value: 'expert' },
  { label: 'Otro', value: 'other' },
];

export const confidenceLevels = [
  { label: 'Bajo', value: 'low' },
  { label: 'Medio', value: 'medium' },
  { label: 'Alto', value: 'high' },
];

export const qualityImpacts = [
  { label: 'Ninguno', value: 'none' },
  { label: 'Menor', value: 'minor' },
  { label: 'Moderado', value: 'moderate' },
  { label: 'Severo', value: 'severe' },
];

export const monitoringFrequencies = [
  { label: 'Diario', value: 'daily' },
  { label: 'Semanal', value: 'weekly' },
  { label: 'Quincenal', value: 'biweekly' },
  { label: 'Mensual', value: 'monthly' },
];

export const statusOptions = [
  { label: 'Identificado', value: 'identified' },
  { label: 'En Tratamiento', value: 'under_treatment' },
  { label: 'Controlado', value: 'controlled' },
  { label: 'Resuelto', value: 'resolved' },
];

export const imageTypes = [
  { label: 'Síntoma', value: 'symptom' },
  { label: 'Daño', value: 'damage' },
  { label: 'Tratamiento', value: 'treatment' },
  { label: 'Recuperación', value: 'recovery' },
];
