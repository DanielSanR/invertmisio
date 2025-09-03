import Realm from 'realm';

class LotSchema extends Realm.Object {
  static schema = {
    name: 'Lot',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      area: 'double',
      coordinates: 'Location[]',
      createdAt: 'date',
      updatedAt: 'date',
    },
  };
}

class LocationSchema extends Realm.Object {
  static schema = {
    name: 'Location',
    embedded: true,
    properties: {
      latitude: 'double',
      longitude: 'double',
    },
  };
}

class CropHistorySchema extends Realm.Object {
  static schema = {
    name: 'CropHistory',
    primaryKey: 'id',
    properties: {
      id: 'string',
      lotId: 'string',
      cropType: 'string',
      startDate: 'date',
      endDate: 'date?',
      yield: 'double?',
      notes: 'string?',
    },
  };
}

class TreatmentSchema extends Realm.Object {
  static schema = {
    name: 'Treatment',
    primaryKey: 'id',
    properties: {
      id: 'string',
      lotId: 'string',
      type: 'string',
      product: 'string',
      quantity: 'double',
      unit: 'string',
      applicationDate: 'date',
      applicator: 'string',
      weather: 'mixed?',
      notes: 'string?',
    },
  };
}

class HealthRecordSchema extends Realm.Object {
  static schema = {
    name: 'HealthRecord',
    primaryKey: 'id',
    properties: {
      id: 'string',
      lotId: 'string',
      date: 'date',
      type: 'string',
      severity: 'string',
      description: 'string',
      affectedArea: 'double?',
      images: 'string?[]',
      notes: 'string?',
    },
  };
}

class InfrastructureSchema extends Realm.Object {
  static schema = {
    name: 'Infrastructure',
    primaryKey: 'id',
    properties: {
      id: 'string',
      lotId: 'string',
      type: 'string',
      status: 'string',
      lastInspection: 'date',
      nextInspection: 'date',
      notes: 'string?',
    },
  };
}

class ImageRecordSchema extends Realm.Object {
  static schema = {
    name: 'ImageRecord',
    primaryKey: 'id',
    properties: {
      id: 'string',
      lotId: 'string',
      uri: 'string',
      type: 'string',
      date: 'date',
      notes: 'string?',
      location: 'Location?',
    },
  };
}

class TaskSchema extends Realm.Object {
  static schema = {
    name: 'Task',
    primaryKey: 'id',
    properties: {
      id: 'string',
      lotId: 'string?',
      title: 'string',
      description: 'string?',
      dueDate: 'date',
      priority: 'string',
      status: 'string',
      assignedTo: 'string?',
      category: 'string',
      completedAt: 'date?',
      notes: 'string?',
    },
  };
}

class EconomicRecordSchema extends Realm.Object {
  static schema = {
    name: 'EconomicRecord',
    primaryKey: 'id',
    properties: {
      id: 'string',
      lotId: 'string?',
      date: 'date',
      type: 'string',
      category: 'string',
      amount: 'double',
      description: 'string',
      paymentMethod: 'string?',
      invoice: 'string?',
      notes: 'string?',
    },
  };
}

class AlertSchema extends Realm.Object {
  static schema = {
    name: 'Alert',
    primaryKey: 'id',
    properties: {
      id: 'string',
      lotId: 'string?',
      type: 'string',
      severity: 'string',
      title: 'string',
      description: 'string',
      createdAt: 'date',
      expiresAt: 'date?',
      acknowledged: 'bool',
      relatedTaskId: 'string?',
    },
  };
}

const schemas = [
  LocationSchema,
  LotSchema,
  CropHistorySchema,
  TreatmentSchema,
  HealthRecordSchema,
  InfrastructureSchema,
  ImageRecordSchema,
  TaskSchema,
  EconomicRecordSchema,
  AlertSchema,
];

let realm: Realm;

export const initializeRealm = async () => {
  try {
    realm = await Realm.open({
      schema: schemas,
      schemaVersion: 1,
    });
    console.log('Realm initialized successfully');
    return realm;
  } catch (error) {
    console.error('Failed to initialize Realm:', error);
    throw error;
  }
};

export const getRealm = () => {
  if (!realm) {
    throw new Error('Realm has not been initialized. Call initializeRealm first.');
  }
  return realm;
};

export default {
  initializeRealm,
  getRealm,
};
