import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { mockApiService } from '../services/mockApiService';
import type { Lot, Task, Treatment, HealthRecord } from '../types/models';

interface DashboardStats {
  totalLots: number;
  activeLots: number;
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  totalTreatments: number;
  recentTreatments: number;
  totalHealthRecords: number;
  activeHealthIssues: number;
}

const DashboardScreen = () => {
  const theme = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);

      // Load all data in parallel
      const [lots, tasks, treatments, healthRecords] = await Promise.all([
        mockApiService.getLots(),
        mockApiService.getTasks(),
        mockApiService.getTreatments(),
        mockApiService.getHealthRecords()
      ]);

      // Calculate statistics
      const dashboardStats: DashboardStats = {
        totalLots: lots.length,
        activeLots: lots.filter(lot => lot.status === 'active').length,
        totalTasks: tasks.length,
        pendingTasks: tasks.filter(task => task.status === 'pending').length,
        completedTasks: tasks.filter(task => task.status === 'completed').length,
        totalTreatments: treatments.length,
        recentTreatments: treatments.filter(treatment => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return treatment.applicationDate >= weekAgo;
        }).length,
        totalHealthRecords: healthRecords.length,
        activeHealthIssues: healthRecords.filter(record => record.status === 'under_treatment').length
      };

      setStats(dashboardStats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: string;
  }) => (
    <Card style={styles.statCard}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.statValue}>{value}</Text>
        <Text variant="bodyMedium" style={styles.statTitle}>{title}</Text>
        {subtitle && (
          <Text variant="bodySmall" style={styles.statSubtitle}>{subtitle}</Text>
        )}
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="bodyLarge" style={styles.errorText}>
          Error al cargar las estadísticas
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Dashboard</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Resumen general de la finca
        </Text>
      </View>

      <View style={styles.statsGrid}>
        {/* Lots Stats */}
        <StatCard
          title="Total Lotes"
          value={stats.totalLots}
          subtitle={`${stats.activeLots} activos`}
        />
        <StatCard
          title="Lotes Activos"
          value={stats.activeLots}
          subtitle="En producción"
        />

        {/* Tasks Stats */}
        <StatCard
          title="Total Tareas"
          value={stats.totalTasks}
          subtitle={`${stats.pendingTasks} pendientes`}
        />
        <StatCard
          title="Tareas Completadas"
          value={stats.completedTasks}
          subtitle="Este mes"
        />

        {/* Treatments Stats */}
        <StatCard
          title="Tratamientos"
          value={stats.totalTreatments}
          subtitle={`${stats.recentTreatments} recientes`}
        />

        {/* Health Records Stats */}
        <StatCard
          title="Registros de Salud"
          value={stats.totalHealthRecords}
          subtitle={`${stats.activeHealthIssues} activos`}
        />
      </View>

      <View style={styles.recentActivity}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Actividad Reciente</Text>

        <Card style={styles.activityCard}>
          <Card.Content>
            <Text variant="bodyMedium">
              • {stats.pendingTasks} tareas pendientes requieren atención
            </Text>
            <Text variant="bodyMedium">
              • {stats.activeHealthIssues} problemas de salud en tratamiento
            </Text>
            <Text variant="bodyMedium">
              • {stats.recentTreatments} tratamientos aplicados en la última semana
            </Text>
            <Text variant="bodyMedium">
              • {stats.activeLots} lotes en producción activa
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  subtitle: {
    marginTop: 4,
    color: '#666',
  },
  statsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: 'white',
  },
  statValue: {
    fontWeight: 'bold',
    color: '#2e7d32',
    fontSize: 28,
  },
  statTitle: {
    marginTop: 8,
    color: '#333',
  },
  statSubtitle: {
    marginTop: 4,
    color: '#666',
    fontSize: 12,
  },
  recentActivity: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  activityCard: {
    backgroundColor: 'white',
  },
});

export default DashboardScreen;
