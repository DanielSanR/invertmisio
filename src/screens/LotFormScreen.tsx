import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { TextInput, Button, useTheme, Text } from 'react-native-paper';
import MapView, { Polygon, MapEvent } from 'react-native-maps';
import { getRealm } from '../services/realm';
import type { Location, Lot } from '../types/models';

interface LotFormScreenProps {
  route?: {
    params?: {
      lot?: Lot;
    };
  };
  navigation: any;
}

const LotFormScreen: React.FC<LotFormScreenProps> = ({ route, navigation }) => {
  const theme = useTheme();
  const existingLot = route?.params?.lot;
  
  const [name, setName] = useState(existingLot?.name || '');
  const [area, setArea] = useState(existingLot?.area.toString() || '');
  const [coordinates, setCoordinates] = useState<Location[]>(existingLot?.coordinates || []);
  const [isDrawing, setIsDrawing] = useState(false);

  const initialRegion = {
    latitude: -27.3667,  // Posadas, Misiones
    longitude: -55.8969,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  const handleMapPress = (event: MapEvent) => {
    if (!isDrawing) return;

    const newCoordinate = {
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    };

    setCoordinates([...coordinates, newCoordinate]);
  };

  const handleSave = async () => {
    if (!name || !area || coordinates.length < 3) {
      // Show error
      return;
    }

    const realm = getRealm();
    const lotData = {
      id: existingLot?.id || new Date().getTime().toString(),
      name,
      area: parseFloat(area),
      coordinates,
      createdAt: existingLot?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    try {
      realm.write(() => {
        realm.create('Lot', lotData, existingLot ? 'modified' : 'all');
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving lot:', error);
    }
  };

  const resetDrawing = () => {
    setCoordinates([]);
    setIsDrawing(false);
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Nombre del Lote"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        label="Área (hectáreas)"
        value={area}
        onChangeText={setArea}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text variant="titleMedium" style={styles.mapTitle}>
        Definir Coordenadas del Lote
      </Text>

      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text variant="titleMedium" style={styles.placeholderTitle}>
            Vista de Coordenadas
          </Text>
          <Text variant="bodyMedium" style={styles.placeholderText}>
            Mapa no disponible - Ingrese coordenadas manualmente
          </Text>

          <View style={styles.coordinatesList}>
            <Text variant="bodyMedium" style={styles.coordinatesCount}>
              Coordenadas definidas: {coordinates.length}
            </Text>
            {coordinates.length > 0 && (
              <Text variant="bodySmall" style={styles.coordinatesPreview}>
                Primera coordenada: {coordinates[0].latitude.toFixed(4)}, {coordinates[0].longitude.toFixed(4)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.mapButtons}>
          <Button
            mode={isDrawing ? 'contained' : 'outlined'}
            onPress={() => setIsDrawing(!isDrawing)}
            style={styles.mapButton}
          >
            {isDrawing ? 'Finalizar Dibujo' : 'Modo Dibujo'}
          </Button>

          <Button
            mode="outlined"
            onPress={resetDrawing}
            style={styles.mapButton}
          >
            Reiniciar
          </Button>
        </View>
      </View>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  mapTitle: {
    marginBottom: 8,
  },
  mapContainer: {
    marginBottom: 16,
  },
  map: {
    width: Dimensions.get('window').width - 32,
    height: 300,
    marginBottom: 8,
  },
  mapButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonContainer: {
    gap: 8,
    marginBottom: 32,
  },
  button: {
    marginTop: 8,
  },
  mapPlaceholder: {
    width: Dimensions.get('window').width - 32,
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  placeholderTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  placeholderText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  coordinatesList: {
    width: '100%',
    alignItems: 'center',
  },
  coordinatesCount: {
    fontWeight: '500',
  },
  coordinatesPreview: {
    color: '#666',
    marginTop: 4,
  },
});

export default LotFormScreen;
