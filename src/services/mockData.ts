import {
  Lot,
  CropHistory,
  Treatment,
  HealthRecord,
  Task,
  Infrastructure,
  UserProfile
} from '../types/models';
import { UserProfile as AuthUserProfile } from './authService';

// Mock user data
export const mockUsers: AuthUserProfile[] = [
  {
    id: 'user-1',
    email: 'admin@invertrack.com',
    displayName: 'Administrador',
    role: 'admin',
    organization: 'InverTrack',
    phoneNumber: '+56912345678',
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date('2024-11-01'),
  },
  {
    id: 'user-2',
    email: 'tecnico@invertrack.com',
    displayName: 'Técnico Agrícola',
    role: 'worker',
    organization: 'InverTrack',
    phoneNumber: '+56987654321',
    createdAt: new Date('2024-01-15'),
    lastLoginAt: new Date('2024-11-01'),
  }
];

// Mock lots data
export const mockLots: Lot[] = [
  {
    id: 'lot-1',
    name: 'Lote Norte',
    code: 'LN-001',
    area: 25.5,
    coordinates: [
      { latitude: -33.4567, longitude: -70.6483 },
      { latitude: -33.4567, longitude: -70.6450 },
      { latitude: -33.4534, longitude: -70.6450 },
      { latitude: -33.4534, longitude: -70.6483 }
    ],
    soilType: 'Arcilloso',
    irrigation: {
      type: 'drip',
      description: 'Sistema de riego por goteo automatizado'
    },
    slope: 5,
    orientation: 'N',
    status: 'active',
    notes: 'Lote principal con buena exposición solar',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-15'),
    lastInspectionDate: new Date('2024-03-10'),
    ownerId: 'user-1',
    organizationId: 'org-1'
  },
  {
    id: 'lot-2',
    name: 'Lote Sur',
    code: 'LS-002',
    area: 18.3,
    coordinates: [
      { latitude: -33.4600, longitude: -70.6483 },
      { latitude: -33.4600, longitude: -70.6450 },
      { latitude: -33.4567, longitude: -70.6450 },
      { latitude: -33.4567, longitude: -70.6483 }
    ],
    soilType: 'Franco',
    irrigation: {
      type: 'sprinkler',
      description: 'Aspersores fijos cada 12m'
    },
    slope: 3,
    orientation: 'S',
    status: 'active',
    notes: 'Lote secundario, requiere más atención al riego',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-12'),
    lastInspectionDate: new Date('2024-03-08'),
    ownerId: 'user-1',
    organizationId: 'org-1'
  },
  {
    id: 'lot-3',
    name: 'Lote Este',
    code: 'LE-003',
    area: 32.1,
    coordinates: [
      { latitude: -33.4567, longitude: -70.6420 },
      { latitude: -33.4567, longitude: -70.6387 },
      { latitude: -33.4534, longitude: -70.6387 },
      { latitude: -33.4534, longitude: -70.6420 }
    ],
    soilType: 'Arenoso',
    irrigation: {
      type: 'flood',
      description: 'Riego por inundación controlada'
    },
    slope: 8,
    orientation: 'E',
    status: 'fallow',
    notes: 'En descanso por rotación de cultivos',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-01'),
    ownerId: 'user-1',
    organizationId: 'org-1'
  }
];

// Mock crop history data
export const mockCropHistories: CropHistory[] = [
  {
    id: 'crop-1',
    lotId: 'lot-1',
    cropType: 'Tomate',
    variety: 'Roma VF',
    season: '2024-Primavera',
    startDate: new Date('2024-09-01'),
    plantingDate: new Date('2024-09-15'),
    expectedHarvestDate: new Date('2025-01-15'),
    density: {
      plantsPerHectare: 25000,
      rowSpacing: 1.2,
      plantSpacing: 0.4
    },
    fertilization: [
      {
        date: new Date('2024-09-20'),
        product: 'Nitrógeno 20-10-10',
        amount: 150,
        unit: 'kg/ha',
        method: 'fertirrigación'
      },
      {
        date: new Date('2024-10-15'),
        product: 'Fósforo 10-50-10',
        amount: 100,
        unit: 'kg/ha',
        method: 'fertirrigación'
      }
    ],
    irrigation: [
      {
        date: new Date('2024-09-16'),
        duration: 2,
        amount: 25,
        type: 'drip'
      },
      {
        date: new Date('2024-09-18'),
        duration: 2.5,
        amount: 30,
        type: 'drip'
      }
    ],
    weather: {
      averageTemperature: 22,
      totalRainfall: 45,
      extremeEvents: [
        {
          date: new Date('2024-10-05'),
          type: 'wind',
          description: 'Vientos fuertes que afectaron el polinizado'
        }
      ]
    },
    costs: {
      seeds: 2500,
      fertilizers: 1800,
      pesticides: 950,
      labor: 3200,
      irrigation: 1200,
      other: 300
    },
    status: 'in_progress',
    notes: 'Buen desarrollo inicial, atención a plagas',
    images: ['crop-1-img-1.jpg', 'crop-1-img-2.jpg'],
    createdBy: 'user-2',
    organizationId: 'org-1',
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-11-01')
  },
  {
    id: 'crop-2',
    lotId: 'lot-2',
    cropType: 'Lechuga',
    variety: 'Iceberg',
    season: '2024-Invierno',
    startDate: new Date('2024-06-01'),
    plantingDate: new Date('2024-06-10'),
    expectedHarvestDate: new Date('2024-09-15'),
    actualHarvestDate: new Date('2024-09-12'),
    endDate: new Date('2024-09-20'),
    yield: {
      amount: 28000,
      unit: 'kg',
      quality: 'excellent'
    },
    density: {
      plantsPerHectare: 80000,
      rowSpacing: 0.3,
      plantSpacing: 0.15
    },
    fertilization: [
      {
        date: new Date('2024-06-15'),
        product: 'Completo 15-15-15',
        amount: 200,
        unit: 'kg/ha',
        method: 'fertirrigación'
      }
    ],
    irrigation: [
      {
        date: new Date('2024-06-11'),
        duration: 1.5,
        amount: 20,
        type: 'sprinkler'
      }
    ],
    weather: {
      averageTemperature: 18,
      totalRainfall: 120
    },
    costs: {
      seeds: 800,
      fertilizers: 600,
      pesticides: 400,
      labor: 1500,
      irrigation: 800,
      other: 150
    },
    status: 'completed',
    notes: 'Cosecha exitosa, buena calidad del producto',
    images: ['crop-2-img-1.jpg'],
    createdBy: 'user-2',
    organizationId: 'org-1',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-09-20')
  }
];

// Mock treatments data
export const mockTreatments: Treatment[] = [
  {
    id: 'treatment-1',
    lotId: 'lot-1',
    cropHistoryId: 'crop-1',
    type: 'pesticide',
    category: 'Insecticida',
    product: 'Confidor 200 SL',
    activeIngredient: 'Imidacloprid',
    concentration: '200 g/L',
    quantity: 2.5,
    unit: 'L/ha',
    dosagePerHectare: 0.75,
    applicationMethod: 'spray',
    applicationDate: new Date('2024-10-20'),
    nextApplicationDate: new Date('2024-11-05'),
    applicator: 'Juan Pérez',
    equipment: 'Mochila pulverizadora',
    targetProblem: 'Áfidos en hojas',
    weather: {
      temperature: 24,
      humidity: 65,
      windSpeed: 8,
      windDirection: 'NW',
      conditions: 'partially_cloudy',
      soilMoisture: 'moderate'
    },
    effectiveness: {
      rating: 4,
      evaluationDate: new Date('2024-10-25'),
      observations: 'Reducción significativa de población de áfidos'
    },
    costs: {
      product: 450,
      labor: 120,
      equipment: 50,
      other: 25
    },
    safetyMeasures: {
      reentryInterval: 24,
      harvestInterval: 21,
      protectiveEquipment: ['guantes', 'máscara', 'overol']
    },
    certification: {
      organic: false,
      certifier: 'SENASA',
      certificationNumber: 'CERT-2024-001'
    },
    images: ['treatment-1-img-1.jpg'],
    notes: 'Aplicación preventiva contra áfidos',
    status: 'applied',
    createdBy: 'user-2',
    organizationId: 'org-1',
    createdAt: new Date('2024-10-19'),
    updatedAt: new Date('2024-10-25')
  },
  {
    id: 'treatment-2',
    lotId: 'lot-1',
    cropHistoryId: 'crop-1',
    type: 'fertilizer',
    category: 'Fertilizante foliar',
    product: 'Bayfolan Forte',
    activeIngredient: 'Manganeso + Zinc + Magnesio',
    concentration: '15% Mn + 7% Zn + 3% Mg',
    quantity: 3,
    unit: 'L/ha',
    dosagePerHectare: 3,
    applicationMethod: 'foliar',
    applicationDate: new Date('2024-11-01'),
    applicator: 'María González',
    equipment: 'Pulverizador tractorizado',
    targetProblem: 'Deficiencia de micronutrientes',
    weather: {
      temperature: 22,
      humidity: 70,
      windSpeed: 5,
      conditions: 'sunny',
      soilMoisture: 'moderate'
    },
    costs: {
      product: 380,
      labor: 80,
      equipment: 60
    },
    safetyMeasures: {
      reentryInterval: 12,
      harvestInterval: 0,
      protectiveEquipment: ['guantes', 'gafas']
    },
    certification: {
      organic: true,
      certifier: 'Certificadora Orgánica',
      certificationNumber: 'ORG-2024-045'
    },
    notes: 'Aplicación correctiva por síntomas de clorosis',
    status: 'planned',
    createdBy: 'user-2',
    organizationId: 'org-1',
    createdAt: new Date('2024-10-30'),
    updatedAt: new Date('2024-10-30')
  }
];

// Mock health records data
export const mockHealthRecords: HealthRecord[] = [
  {
    id: 'health-1',
    lotId: 'lot-1',
    cropHistoryId: 'crop-1',
    date: new Date('2024-10-18'),
    type: 'pest',
    category: 'Áfidos',
    name: 'Áfidos verdes',
    scientificName: 'Aphididae',
    severity: 'medium',
    stage: 'developing',
    description: 'Infestación de áfidos en hojas medias y superiores',
    symptoms: ['manchas amarillas', 'deformación foliar', 'presencia de insectos'],
    affectedArea: {
      size: 15,
      percentage: 12,
      distribution: 'scattered',
      location: 'center'
    },
    cropStage: 'floritación',
    environmentalConditions: {
      temperature: 24,
      humidity: 65,
      rainfall: 5,
      soilMoisture: 'moderate',
      soilCondition: 'húmedo'
    },
    diagnosis: {
      confirmedBy: 'Dr. Juan Pérez',
      method: 'visual',
      date: new Date('2024-10-18'),
      confidence: 'high'
    },
    treatment: {
      recommended: ['Aplicación de insecticida sistémico Confidor 200 SL'],
      applied: ['Aplicación de insecticida sistémico Confidor 200 SL'],
      effectiveness: 4,
      treatmentDate: new Date('2024-10-20'),
      followUpDate: new Date('2024-10-25')
    },
    prevention: {
      recommendations: [
        'Monitoreo semanal',
        'Liberación de enemigos naturales',
        'Rotación de cultivos'
      ],
      implementedMeasures: ['Monitoreo semanal']
    },
    impact: {
      yieldLoss: 8,
      qualityImpact: 'moderate',
      economicLoss: 1200
    },
    monitoring: {
      frequency: 'weekly',
      method: 'Inspección visual',
      responsiblePerson: 'Técnico Agrícola',
      nextInspectionDate: new Date('2024-10-25')
    },
    images: [
      {
        uri: 'health-1-img-1.jpg',
        type: 'symptom',
        date: new Date('2024-10-18'),
        description: 'Hojas con síntomas de áfidos'
      },
      {
        uri: 'health-1-img-2.jpg',
        type: 'damage',
        date: new Date('2024-10-18'),
        description: 'Daño en hojas causado por áfidos'
      },
      {
        uri: 'health-1-img-3.jpg',
        type: 'treatment',
        date: new Date('2024-10-20'),
        description: 'Aplicación del tratamiento'
      }
    ],
    status: 'under_treatment',
    notes: 'Primera detección de plagas en la temporada',
    createdBy: 'user-2',
    organizationId: 'org-1',
    createdAt: new Date('2024-10-18'),
    updatedAt: new Date('2024-10-20')
  },
  {
    id: 'health-2',
    lotId: 'lot-2',
    cropHistoryId: 'crop-2',
    date: new Date('2024-08-15'),
    type: 'disease',
    category: 'Hongos de raíz',
    name: 'Fusarium',
    scientificName: 'Fusarium oxysporum',
    severity: 'low',
    stage: 'early',
    description: 'Síntomas de fusarium en plantas jóvenes',
    symptoms: ['marchitamiento', 'amarillamiento', 'reducción crecimiento'],
    affectedArea: {
      size: 5,
      percentage: 8,
      distribution: 'scattered',
      location: 'edge'
    },
    cropStage: 'crecimiento vegetativo',
    environmentalConditions: {
      temperature: 18,
      humidity: 70,
      rainfall: 120,
      soilMoisture: 'wet',
      soilCondition: 'encharcado'
    },
    diagnosis: {
      confirmedBy: 'Laboratorio Agrícola',
      method: 'laboratory',
      date: new Date('2024-08-16'),
      confidence: 'high'
    },
    treatment: {
      recommended: ['Aplicación de fungicida preventivo', 'Mejora del drenaje'],
      applied: ['Aplicación de fungicida preventivo', 'Mejora del drenaje'],
      effectiveness: 3,
      treatmentDate: new Date('2024-08-17'),
      followUpDate: new Date('2024-09-01')
    },
    prevention: {
      recommendations: [
        'Mejora del drenaje del suelo',
        'Desinfección de semillas',
        'Rotación de cultivos de 3 años'
      ],
      implementedMeasures: ['Mejora del drenaje del suelo']
    },
    impact: {
      yieldLoss: 5,
      qualityImpact: 'minor',
      economicLoss: 800
    },
    monitoring: {
      frequency: 'weekly',
      method: 'Análisis de laboratorio',
      responsiblePerson: 'Técnico Agrícola',
      nextInspectionDate: new Date('2024-08-22')
    },
    images: [
      {
        uri: 'health-2-img-1.jpg',
        type: 'symptom',
        date: new Date('2024-08-15'),
        description: 'Plantas con síntomas de fusarium'
      }
    ],
    status: 'resolved',
    resolution: {
      date: new Date('2024-09-01'),
      effectiveness: 4,
      notes: 'Tratamiento efectivo, plantas recuperadas'
    },
    notes: 'Enfermedad del suelo detectada en plantas jóvenes',
    createdBy: 'user-2',
    organizationId: 'org-1',
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-09-01')
  }
];

// Mock tasks data
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    lotId: 'lot-1',
    title: 'Monitoreo semanal de plagas',
    description: 'Revisar lotes para detectar presencia de plagas y enfermedades',
    dueDate: new Date('2024-11-05'),
    priority: 'high',
    status: 'pending',
    assignedTo: 'user-2',
    category: 'other',
    notes: 'Enfocarse en síntomas de áfidos y mildiu'
  },
  {
    id: 'task-2',
    title: 'Aplicación de fertilizante',
    description: 'Aplicar fertilizante nitrogenado en Lote Norte',
    dueDate: new Date('2024-10-30'),
    completedAt: new Date('2024-10-28'),
    priority: 'medium',
    status: 'completed',
    assignedTo: 'user-2',
    lotId: 'lot-1',
    category: 'treatment',
    notes: 'Aplicación realizada según plan nutricional'
  },
  {
    id: 'task-3',
    title: 'Mantenimiento sistema riego',
    description: 'Revisar y limpiar filtros del sistema de riego por goteo',
    dueDate: new Date('2024-11-10'),
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'user-2',
    lotId: 'lot-1',
    category: 'maintenance',
    notes: 'Mantenimiento preventivo mensual'
  }
];

// Mock infrastructure data
export const mockInfrastructure: Infrastructure[] = [
  {
    id: 'infra-1',
    lotId: 'lot-1',
    type: 'irrigation',
    status: 'good',
    lastInspection: new Date('2024-09-20'),
    nextInspection: new Date('2024-12-20'),
    notes: 'Sistema funcionando correctamente, requiere mantenimiento preventivo'
  },
  {
    id: 'infra-2',
    lotId: 'lot-1',
    type: 'storage',
    status: 'good',
    lastInspection: new Date('2024-08-15'),
    nextInspection: new Date('2025-02-15'),
    notes: 'Almacén en buen estado, sistema de climatización funcionando'
  }
];

// Helper functions to get data
export const getMockLots = () => mockLots;
export const getMockCropHistories = () => mockCropHistories;
export const getMockTreatments = () => mockTreatments;
export const getMockHealthRecords = () => mockHealthRecords;
export const getMockTasks = () => mockTasks;
export const getMockInfrastructure = () => mockInfrastructure;
export const getMockUsers = () => mockUsers;

// Get data by ID
export const getMockLotById = (id: string) => mockLots.find(lot => lot.id === id);
export const getMockCropHistoryById = (id: string) => mockCropHistories.find(crop => crop.id === id);
export const getMockTreatmentById = (id: string) => mockTreatments.find(treatment => treatment.id === id);
export const getMockHealthRecordById = (id: string) => mockHealthRecords.find(record => record.id === id);
export const getMockTaskById = (id: string) => mockTasks.find(task => task.id === id);
export const getMockInfrastructureById = (id: string) => mockInfrastructure.find(item => item.id === id);

// Get data by relationships
export const getMockCropHistoriesByLotId = (lotId: string) =>
  mockCropHistories.filter(crop => crop.lotId === lotId);

export const getMockTreatmentsByLotId = (lotId: string) =>
  mockTreatments.filter(treatment => treatment.lotId === lotId);

export const getMockHealthRecordsByLotId = (lotId: string) =>
  mockHealthRecords.filter(record => record.lotId === lotId);

export const getMockTasksByLotId = (lotId: string) =>
  mockTasks.filter(task => task.lotId === lotId);
