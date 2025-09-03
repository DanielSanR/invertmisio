export interface Location {
  latitude: number;
  longitude: number;
}

export interface Lot {
  id: string;
  name: string;
  code: string;
  area: number; // in hectares
  coordinates: Location[];
  soilType?: string;
  irrigation?: {
    type: 'drip' | 'sprinkler' | 'flood' | 'none';
    description?: string;
  };
  slope?: number; // percentage
  orientation?: 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';
  status: 'active' | 'fallow' | 'preparation' | 'inactive';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  lastInspectionDate?: Date;
  ownerId: string;
  organizationId: string;
}

export interface CropHistory {
  id: string;
  lotId: string;
  cropType: string;
  variety: string;
  season: string;
  startDate: Date;
  plantingDate: Date;
  expectedHarvestDate: Date;
  actualHarvestDate?: Date;
  endDate?: Date;
  yield?: {
    amount: number;
    unit: string;
    quality?: 'excellent' | 'good' | 'fair' | 'poor';
  };
  density: {
    plantsPerHectare: number;
    rowSpacing: number; // in meters
    plantSpacing: number; // in meters
  };
  fertilization: Array<{
    date: Date;
    product: string;
    amount: number;
    unit: string;
    method: string;
  }>;
  irrigation: Array<{
    date: Date;
    duration: number; // in hours
    amount?: number; // in mm or liters
    type: 'drip' | 'sprinkler' | 'flood';
  }>;
  weather: {
    averageTemperature?: number;
    totalRainfall?: number;
    extremeEvents?: Array<{
      date: Date;
      type: 'frost' | 'hail' | 'drought' | 'flood' | 'wind';
      description: string;
    }>;
  };
  costs: {
    seeds?: number;
    fertilizers?: number;
    pesticides?: number;
    labor?: number;
    irrigation?: number;
    other?: number;
  };
  status: 'planned' | 'in_progress' | 'harvested' | 'failed' | 'completed';
  failureReason?: string;
  notes?: string;
  images?: string[];
  createdBy: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Treatment {
  id: string;
  lotId: string;
  cropHistoryId?: string;
  type: 'fertilizer' | 'pesticide' | 'herbicide' | 'fungicide' | 'biological' | 'other';
  category: string;
  product: string;
  activeIngredient: string;
  concentration: string;
  quantity: number;
  unit: string;
  dosagePerHectare: number;
  applicationMethod: 'spray' | 'drip' | 'granular' | 'foliar' | 'soil' | 'other';
  applicationDate: Date;
  nextApplicationDate?: Date;
  applicator: string;
  equipment: string;
  targetProblem?: string;
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection?: 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';
    conditions: 'sunny' | 'cloudy' | 'partially_cloudy' | 'rainy' | 'windy';
    soilMoisture?: 'dry' | 'moderate' | 'wet';
  };
  effectiveness?: {
    rating: 1 | 2 | 3 | 4 | 5;
    evaluationDate: Date;
    observations: string;
  };
  costs: {
    product: number;
    labor: number;
    equipment: number;
    other?: number;
  };
  safetyMeasures: {
    reentryInterval: number; // hours
    harvestInterval: number; // days
    protectiveEquipment: string[];
  };
  certification?: {
    organic: boolean;
    certifier?: string;
    certificationNumber?: string;
  };
  images?: string[];
  notes?: string;
  status: 'planned' | 'applied' | 'evaluated' | 'cancelled';
  createdBy: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthRecord {
  id: string;
  lotId: string;
  cropHistoryId?: string;
  date: Date;
  type: 'pest' | 'disease' | 'deficiency' | 'weed' | 'stress' | 'other';
  category: string;
  name: string;
  scientificName?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  stage: 'early' | 'developing' | 'advanced' | 'controlled';
  description: string;
  symptoms: string[];
  affectedArea: {
    size: number; // hectares
    percentage: number;
    distribution: 'isolated' | 'scattered' | 'widespread' | 'uniform';
    location: 'edge' | 'center' | 'random' | 'pattern';
  };
  cropStage: string;
  environmentalConditions: {
    temperature: number;
    humidity: number;
    rainfall?: number;
    soilMoisture: 'dry' | 'moderate' | 'wet';
    soilCondition?: string;
  };
  diagnosis: {
    confirmedBy?: string;
    method: 'visual' | 'laboratory' | 'expert' | 'other';
    date: Date;
    confidence: 'low' | 'medium' | 'high';
  };
  treatment: {
    recommended: string[];
    applied?: string[];
    effectiveness?: 1 | 2 | 3 | 4 | 5;
    treatmentDate?: Date;
    followUpDate?: Date;
  };
  prevention: {
    recommendations: string[];
    implementedMeasures?: string[];
  };
  impact: {
    yieldLoss?: number;
    qualityImpact?: 'none' | 'minor' | 'moderate' | 'severe';
    economicLoss?: number;
  };
  monitoring: {
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    method: string;
    responsiblePerson: string;
    nextInspectionDate: Date;
  };
  laboratoryAnalysis?: {
    sampleDate: Date;
    laboratory: string;
    results: string;
    recommendations: string;
  };
  images: {
    uri: string;
    type: 'symptom' | 'damage' | 'treatment' | 'recovery';
    date: Date;
    description?: string;
  }[];
  status: 'identified' | 'under_treatment' | 'controlled' | 'resolved';
  resolution?: {
    date: Date;
    effectiveness: 1 | 2 | 3 | 4 | 5;
    notes: string;
  };
  notes?: string;
  createdBy: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Infrastructure {
  id: string;
  lotId: string;
  type: 'irrigation' | 'greenhouse' | 'storage' | 'other';
  status: 'good' | 'regular' | 'needs_repair' | 'critical';
  lastInspection: Date;
  nextInspection: Date;
  notes?: string;
}

export interface ImageRecord {
  id: string;
  lotId: string;
  uri: string;
  type: 'general' | 'issue' | 'progress' | 'infrastructure';
  date: Date;
  notes?: string;
  location?: Location;
}

export interface Task {
  id: string;
  lotId?: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  category: 'treatment' | 'maintenance' | 'harvest' | 'planting' | 'other';
  completedAt?: Date;
  notes?: string;
}

export interface EconomicRecord {
  id: string;
  lotId?: string;
  date: Date;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  paymentMethod?: string;
  invoice?: string;
  notes?: string;
}

export interface WeatherData {
  date: Date;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  forecast?: {
    date: Date;
    condition: string;
    temperature: {
      min: number;
      max: number;
    };
    rainfall: number;
  }[];
}

export interface Alert {
  id: string;
  lotId?: string;
  type: 'weather' | 'pest' | 'disease' | 'task' | 'maintenance' | 'other';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  createdAt: Date;
  expiresAt?: Date;
  acknowledged: boolean;
  relatedTaskId?: string;
}
