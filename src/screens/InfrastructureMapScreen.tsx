import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { FAB, useTheme, Portal, Modal, Card, Text, Chip, Button, IconButton } from 'react-native-paper';
import { mockApiService } from '../services/mockApiService';
import type { Infrastructure } from '../types/models';

interface InfrastructureMapScreenProps {
  navigation: any;
}

const InfrastructureMapScreen: React.FC<InfrastructureMapScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const [infrastructures, setInfrastructures] = useState<Infrastructure[]>([]);
  const [selectedInfrastructure, setSelectedInfrastructure] = useState<Infrastructure | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadInfrastructures();
  }, []);

  const loadInfrastructures = async () => {
    try {
      const infrastructuresData = await mockApiService.getInfrastructure();
      setInfrastructures(infrastructuresData);
    } catch (error) {
      console.error('Error loading infrastructures:', error);
    }
  };

  const getMarkerColor = (status: Infrastructure['status']) => {
    switch (status) {
      case 'good':
        return '#4CAF50'; // Green color for good status
      case 'regular':
        return '#FF9800'; // Orange color for regular status
      case 'needs_repair':
        return theme.colors.error;
      case 'critical':
        return theme.colors.error;
      default:
        return theme.colors.primary;
    }
  };

  const getTypeIcon = (type: Infrastructure['type']) => {
    switch (type) {
      case 'irrigation':
        return 'water';
      case 'greenhouse':
        return 'greenhouse';
      case 'storage':
        return 'warehouse';
      default:
        return 'domain';
    }
  };

  const getTypeText = (type: Infrastructure['type']) => {
    switch (type) {
      case 'irrigation':
        return 'Sistema de Riego';
      case 'greenhouse':
        return 'Invernadero';
      case 'storage':
        return 'Almacén';
      default:
        return 'Otro';
    }
  };

  const getStatusText = (status: Infrastructure['status']) => {
    switch (status) {
      case 'good':
        return 'Buen Estado';
      case 'regular':
        return 'Estado Regular';
      case 'needs_repair':
        return 'Necesita Reparación';
      case 'critical':
        return 'Estado Crítico';
      default:
        return status;
    }
  };

  const handleMarkerPress = (infrastructure: Infrastructure) => {
    setSelectedInfrastructure(infrastructure);
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapHeader}>
          <Text variant="headlineSmall" style={styles.mapTitle}>
            Infraestructura Agrícola
          </Text>
          <Text variant="bodyMedium" style={styles.mapSubtitle}>
            Vista de ejemplo - Sin mapa interactivo
          </Text>
        </View>

        <ScrollView style={styles.infrastructureList}>
          {infrastructures.length === 0 ? (
            <View style={styles.emptyState}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No hay infraestructura registrada
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtext}>
                Agregue infraestructura para visualizarla aquí
              </Text>
            </View>
          ) : (
            infrastructures.map((infrastructure) => (
              <TouchableOpacity
                key={infrastructure.id}
                style={styles.infrastructureItem}
                onPress={() => handleMarkerPress(infrastructure)}
              >
                <View style={styles.itemHeader}>
                  <View style={styles.itemLeft}>
                    <IconButton
                      icon={getTypeIcon(infrastructure.type)}
                      size={24}
                      iconColor={theme.colors.primary}
                      style={styles.typeIcon}
                    />
                    <View>
                      <Text variant="titleMedium" style={styles.itemTitle}>
                        {getTypeText(infrastructure.type)}
                      </Text>
                      <Text variant="bodySmall" style={styles.itemSubtitle}>
                        ID: {infrastructure.id.slice(0, 8)}...
                      </Text>
                    </View>
                  </View>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getMarkerColor(infrastructure.status) }}
                    style={[
                      styles.statusChip,
                      { borderColor: getMarkerColor(infrastructure.status) }
                    ]}
                  >
                    {getStatusText(infrastructure.status)}
                  </Chip>
                </View>

                <View style={styles.itemDetails}>
                  <Text variant="bodyMedium">
                    Última inspección: {infrastructure.lastInspection.toLocaleDateString()}
                  </Text>
                  <Text variant="bodyMedium">
                    Próxima inspección: {infrastructure.nextInspection.toLocaleDateString()}
                  </Text>
                  {infrastructure.notes && (
                    <Text variant="bodySmall" style={styles.notes}>
                      {infrastructure.notes}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          {selectedInfrastructure && (
            <Card>
              <Card.Content>
                <View style={styles.modalHeader}>
                  <Text variant="titleLarge">
                    {getTypeText(selectedInfrastructure.type)}
                  </Text>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getMarkerColor(selectedInfrastructure.status) }}
                    style={{ borderColor: getMarkerColor(selectedInfrastructure.status) }}
                  >
                    {getStatusText(selectedInfrastructure.status)}
                  </Chip>
                </View>

                <View style={styles.inspectionInfo}>
                  <View>
                    <Text variant="bodyMedium">Última Inspección</Text>
                    <Text variant="bodySmall" style={styles.date}>
                      {selectedInfrastructure.lastInspection.toLocaleDateString()}
                    </Text>
                  </View>
                  <View>
                    <Text variant="bodyMedium">Próxima Inspección</Text>
                    <Text variant="bodySmall" style={styles.date}>
                      {selectedInfrastructure.nextInspection.toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                {selectedInfrastructure.notes && (
                  <Text variant="bodyMedium" style={styles.notes}>
                    {selectedInfrastructure.notes}
                  </Text>
                )}

                <View style={styles.modalActions}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setIsModalVisible(false);
                      navigation.navigate('InfrastructureForm', {
                        infrastructure: selectedInfrastructure,
                      });
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => setIsModalVisible(false)}
                  >
                    Cerrar
                  </Button>
                </View>
              </Card.Content>
            </Card>
          )}
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('InfrastructureForm')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapHeader: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  mapTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mapSubtitle: {
    color: '#666',
  },
  infrastructureList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#999',
  },
  infrastructureItem: {
    backgroundColor: '#fff',
    margin: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    margin: 0,
    marginRight: 12,
  },
  itemTitle: {
    fontWeight: '600',
  },
  itemSubtitle: {
    color: '#666',
    fontSize: 12,
  },
  statusChip: {
    height: 28,
  },
  itemDetails: {
    gap: 4,
  },
  notes: {
    marginBottom: 16,
    fontStyle: 'italic',
    color: '#666',
  },
  // Estilos antiguos (por compatibilidad con modal)
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  callout: {
    padding: 8,
    minWidth: 150,
  },
  modalContent: {
    margin: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inspectionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  date: {
    color: '#666',
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default InfrastructureMapScreen;
