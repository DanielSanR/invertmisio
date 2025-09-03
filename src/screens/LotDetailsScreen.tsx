import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { Text, Card, Button, useTheme, Divider, List, FAB, Portal, Modal } from 'react-native-paper';
import MapView, { Polygon } from 'react-native-maps';
import { getRealm } from '../services/realm';
import type { Lot, CropHistory, Treatment, HealthRecord, Task } from '../types/models';

interface LotDetailsScreenProps {
  route: {
    params: {
      lotId: string;
    };
  };
  navigation: any;
}

const LotDetailsScreen: React.FC<LotDetailsScreenProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const [lot, setLot] = useState<Lot | null>(null);
  const [cropHistory, setCropHistory] = useState<CropHistory[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'crops' | 'treatments' | 'health'>('info');
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    if (route.params?.lotId) {
      loadLotData();
    }
  }, [route.params?.lotId]);

  const loadLotData = () => {
    if (!route.params?.lotId) return;

    const realm = getRealm();
    const lotData = realm.objectForPrimaryKey<Lot>('Lot', route.params.lotId);
    if (lotData) {
      setLot(lotData);

      // Load related data
      const lotCropHistory = realm.objects<CropHistory>('CropHistory')
        .filtered('lotId == $0', route.params.lotId)
        .sorted('startDate', true);
      setCropHistory([...lotCropHistory]);

      const lotTreatments = realm.objects<Treatment>('Treatment')
        .filtered('lotId == $0', route.params.lotId)
        .sorted('applicationDate', true);
      setTreatments([...lotTreatments]);

      const lotHealthRecords = realm.objects<HealthRecord>('HealthRecord')
        .filtered('lotId == $0', route.params.lotId)
        .sorted('date', true);
      setHealthRecords([...lotHealthRecords]);

      const lotTasks = realm.objects<Task>('Task')
        .filtered('lotId == $0 AND status != "completed"', route.params.lotId)
        .sorted('dueDate');
      setTasks([...lotTasks]);
    }
  };

  const renderMap = () => (
    <Card style={styles.mapCard}>
      <View style={styles.mapPlaceholder}>
        <Text variant="titleMedium" style={styles.mapPlaceholderTitle}>
          Vista del Lote
        </Text>
        <Text variant="bodyMedium" style={styles.mapPlaceholderText}>
          Mapa no disponible - Vista de ejemplo
        </Text>
        {lot && (
          <View style={styles.lotInfo}>
            <Text variant="bodyMedium">
              Área: {lot.area} hectáreas
            </Text>
            <Text variant="bodyMedium">
              Coordenadas: {lot.coordinates.length} puntos
            </Text>
            <Text variant="bodySmall" style={styles.coordinatesText}>
              Centro aproximado: {lot.coordinates[0].latitude.toFixed(4)}, {lot.coordinates[0].longitude.toFixed(4)}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );

  const renderGeneralInfo = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge">{lot?.name}</Text>
        <Text variant="bodyLarge">Área: {lot?.area} hectáreas</Text>
        <Text variant="bodyMedium">
          Creado: {lot?.createdAt.toLocaleDateString()}
        </Text>
        <Text variant="bodyMedium">
          Última actualización: {lot?.updatedAt.toLocaleDateString()}
        </Text>
      </Card.Content>
    </Card>
  );

  const renderCropHistory = () => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium">Historial de Cultivos</Text>
          <Button
            mode="contained-tonal"
            onPress={() => navigation.navigate('CropHistoryForm', { lotId: lot?.id })}
          >
            Agregar
          </Button>
        </View>
        {cropHistory.map((crop) => (
          <List.Item
            key={crop.id}
            title={crop.cropType}
            description={`${crop.startDate.toLocaleDateString()} - ${
              crop.endDate ? crop.endDate.toLocaleDateString() : 'Actual'
            }`}
            left={(props) => <List.Icon {...props} icon="sprout" />}
          />
        ))}
      </Card.Content>
    </Card>
  );

  const renderTreatments = () => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium">Tratamientos Aplicados</Text>
          <Button
            mode="contained-tonal"
            onPress={() => navigation.navigate('TreatmentForm', { lotId: lot?.id })}
          >
            Agregar
          </Button>
        </View>
        {treatments.map((treatment) => (
          <List.Item
            key={treatment.id}
            title={treatment.product}
            description={`${treatment.type} - ${treatment.applicationDate.toLocaleDateString()}`}
            left={(props) => <List.Icon {...props} icon="spray" />}
          />
        ))}
      </Card.Content>
    </Card>
  );

  const renderHealthRecords = () => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium">Registros Sanitarios</Text>
          <Button
            mode="contained-tonal"
            onPress={() => navigation.navigate('HealthRecordForm', { lotId: lot?.id })}
          >
            Agregar
          </Button>
        </View>
        {healthRecords.map((record) => (
          <List.Item
            key={record.id}
            title={record.type}
            description={`${record.severity} - ${record.date.toLocaleDateString()}`}
            left={(props) => <List.Icon {...props} icon="alert-circle" />}
          />
        ))}
      </Card.Content>
    </Card>
  );

  const renderTasks = () => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium">Tareas Pendientes</Text>
          <Button
            mode="contained-tonal"
            onPress={() => navigation.navigate('TaskForm', { lotId: lot?.id })}
          >
            Agregar
          </Button>
        </View>
        {tasks.map((task) => (
          <List.Item
            key={task.id}
            title={task.title}
            description={`Vence: ${task.dueDate.toLocaleDateString()}`}
            left={(props) => <List.Icon {...props} icon="calendar-check" />}
          />
        ))}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderMap()}
        {renderGeneralInfo()}
        <Divider style={styles.divider} />
        {renderCropHistory()}
        {renderTreatments()}
        {renderHealthRecords()}
        {renderTasks()}
      </ScrollView>

      <Portal>
        <Modal
          visible={isMenuVisible}
          onDismiss={() => setIsMenuVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <List.Section>
            <List.Item
              title="Agregar Cultivo"
              left={(props) => <List.Icon {...props} icon="sprout" />}
              onPress={() => {
                setIsMenuVisible(false);
                navigation.navigate('CropHistoryForm', { lotId: lot?.id });
              }}
            />
            <List.Item
              title="Registrar Tratamiento"
              left={(props) => <List.Icon {...props} icon="spray" />}
              onPress={() => {
                setIsMenuVisible(false);
                navigation.navigate('TreatmentForm', { lotId: lot?.id });
              }}
            />
            <List.Item
              title="Registro Sanitario"
              left={(props) => <List.Icon {...props} icon="alert-circle" />}
              onPress={() => {
                setIsMenuVisible(false);
                navigation.navigate('HealthRecordForm', { lotId: lot?.id });
              }}
            />
            <List.Item
              title="Nueva Tarea"
              left={(props) => <List.Icon {...props} icon="calendar-plus" />}
              onPress={() => {
                setIsMenuVisible(false);
                navigation.navigate('TaskForm', { lotId: lot?.id });
              }}
            />
          </List.Section>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setIsMenuVisible(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapCard: {
    margin: 16,
    overflow: 'hidden',
  },
  map: {
    width: Dimensions.get('window').width - 32,
    height: 200,
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  divider: {
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  mapPlaceholderTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  mapPlaceholderText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  lotInfo: {
    width: '100%',
    gap: 8,
  },
  coordinatesText: {
    color: '#666',
    fontSize: 12,
  },
});

export default LotDetailsScreen;
