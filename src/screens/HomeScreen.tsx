import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
  const theme = useTheme();

  const QuickAccessCard = ({ title, icon, onPress }: { title: string; icon: string; onPress: () => void }) => (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        <Icon name={icon} size={32} color={theme.colors.primary} />
        <Text variant="titleMedium" style={styles.cardTitle}>{title}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>INVERTRACK</Text>
        <Text variant="titleMedium" style={styles.subtitle}>Gestión Inteligente de Cultivos</Text>
      </View>

      <View style={styles.quickAccess}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Acceso Rápido</Text>
        <View style={styles.cardGrid}>
          <QuickAccessCard
            title="Nuevo Lote"
            icon="map-marker-plus"
            onPress={() => {}}
          />
          <QuickAccessCard
            title="Nueva Tarea"
            icon="calendar-plus"
            onPress={() => {}}
          />
          <QuickAccessCard
            title="Registrar Tratamiento"
            icon="spray"
            onPress={() => {}}
          />
          <QuickAccessCard
            title="Cargar Imagen"
            icon="camera"
            onPress={() => {}}
          />
        </View>
      </View>

      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleLarge">Resumen</Text>
          <View style={styles.summaryItem}>
            <Icon name="map-marker" size={24} color={theme.colors.primary} />
            <Text variant="bodyLarge">5 Lotes Activos</Text>
          </View>
          <View style={styles.summaryItem}>
            <Icon name="calendar-check" size={24} color={theme.colors.primary} />
            <Text variant="bodyLarge">3 Tareas Pendientes</Text>
          </View>
          <View style={styles.summaryItem}>
            <Icon name="alert" size={24} color={theme.colors.error} />
            <Text variant="bodyLarge">1 Alerta Activa</Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 4,
  },
  quickAccess: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 16,
  },
  cardContent: {
    alignItems: 'center',
    padding: 16,
  },
  cardTitle: {
    marginTop: 8,
    textAlign: 'center',
  },
  summaryCard: {
    margin: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
});

export default HomeScreen;
