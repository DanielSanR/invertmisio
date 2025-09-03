import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { FAB, Portal, Modal, Text, useTheme, Button, Card, IconButton } from 'react-native-paper';
import { mockApiService } from '../services/mockApiService';
import type { Lot } from '../types/models';

interface LotsScreenProps {
  navigation: any;
}

const LotsScreen: React.FC<LotsScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [lots, setLots] = useState<Lot[]>([]);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadLots();
  }, []);

  const loadLots = async () => {
    try {
      const lotsData = await mockApiService.getLots();
      setLots(lotsData);
    } catch (error) {
      console.error('Error loading lots:', error);
    }
  };

  const handleLotPress = (lot: Lot) => {
    setSelectedLot(lot);
    setIsModalVisible(true);
  };

  const initialRegion = {
    latitude: -27.3667,  // Posadas, Misiones
    longitude: -55.8969,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  return (
    <View style={styles.container}>
      {/* Lots List View */}
      <View style={styles.listContainer}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Lotes Agrícolas
          </Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            Vista de lista - Sin mapa interactivo
          </Text>
        </View>

        <ScrollView style={styles.lotsList}>
          {lots.length === 0 ? (
            <View style={styles.emptyState}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No hay lotes registrados
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtext}>
                Agregue un lote para comenzar
              </Text>
            </View>
          ) : (
            lots.map((lot) => (
              <TouchableOpacity
                key={lot.id}
                style={styles.lotItem}
                onPress={() => handleLotPress(lot)}
              >
                <Card style={styles.lotCard}>
                  <Card.Content>
                    <View style={styles.lotHeader}>
                      <View style={styles.lotInfo}>
                        <IconButton
                          icon="map-marker"
                          size={24}
                          iconColor={theme.colors.primary}
                          style={styles.lotIcon}
                        />
                        <View>
                          <Text variant="titleMedium" style={styles.lotName}>
                            {lot.name}
                          </Text>
                          <Text variant="bodySmall" style={styles.lotId}>
                            ID: {lot.id.slice(0, 8)}...
                          </Text>
                        </View>
                      </View>
                      <Text variant="headlineSmall" style={styles.lotArea}>
                        {lot.area} ha
                      </Text>
                    </View>

                    <View style={styles.lotDetails}>
                      <Text variant="bodyMedium">
                        Coordenadas: {lot.coordinates.length} puntos
                      </Text>
                      <Text variant="bodySmall" style={styles.createdDate}>
                        Creado: {lot.createdAt.toLocaleDateString()}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
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
          {selectedLot && (
            <View>
              <Text variant="headlineSmall">{selectedLot.name}</Text>
              <Text variant="bodyLarge" style={styles.modalText}>
                Área: {selectedLot.area} hectáreas
              </Text>
              <View style={styles.modalButtons}>
                <Button
                  mode="contained"
                  onPress={() => {
                    setIsModalVisible(false);
                    navigation.navigate('LotDetails', { lotId: selectedLot.id });
                  }}
                >
                  Ver Detalles
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => setIsModalVisible(false)}
                >
                  Cerrar
                </Button>
              </View>
            </View>
          )}
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('LotForm')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#666',
  },
  lotsList: {
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
  lotItem: {
    margin: 8,
    marginHorizontal: 16,
  },
  lotCard: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  lotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lotIcon: {
    margin: 0,
    marginRight: 12,
  },
  lotName: {
    fontWeight: '600',
  },
  lotId: {
    color: '#666',
    fontSize: 12,
  },
  lotArea: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  lotDetails: {
    gap: 4,
  },
  createdDate: {
    color: '#666',
  },
  // Estilos antiguos (por compatibilidad con modal)
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalText: {
    marginVertical: 8,
  },
  modalButtons: {
    marginTop: 16,
    gap: 8,
  },
});

export default LotsScreen;
