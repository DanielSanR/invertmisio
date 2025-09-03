import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  Card,
  Text,
  useTheme,
  Searchbar,
  Chip,
  FAB,
  ProgressBar,
  Menu,
  IconButton,
  Divider,
  Portal,
} from 'react-native-paper';
import MaintenanceReportDialog from '../components/MaintenanceReportDialog';
import { getRealm } from '../services/realm';
import type { Infrastructure } from '../types/models';

interface InfrastructureListScreenProps {
  navigation: any;
}

type FilterType = 'all' | 'irrigation' | 'greenhouse' | 'storage' | 'other';
type FilterStatus = 'all' | 'good' | 'regular' | 'needs_repair' | 'critical';
type SortOption = 'type' | 'status' | 'nextInspection';

const InfrastructureListScreen: React.FC<InfrastructureListScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const [infrastructures, setInfrastructures] = useState<Infrastructure[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('nextInspection');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [reportDialogVisible, setReportDialogVisible] = useState(false);

  useEffect(() => {
    loadInfrastructures();
  }, []);

  const loadInfrastructures = () => {
    const realm = getRealm();
    const realmInfrastructures = realm
      .objects<Infrastructure>('Infrastructure')
      .sorted('nextInspection');
    setInfrastructures([...realmInfrastructures]);
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

  const getStatusColor = (status: Infrastructure['status']) => {
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

  const getStatusProgress = (status: Infrastructure['status']) => {
    switch (status) {
      case 'good':
        return 1;
      case 'regular':
        return 0.7;
      case 'needs_repair':
        return 0.4;
      case 'critical':
        return 0.2;
      default:
        return 0;
    }
  };

  const getDaysDifference = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getInspectionStatus = (infrastructure: Infrastructure) => {
    const daysToInspection = getDaysDifference(infrastructure.nextInspection);
    if (daysToInspection < 0) {
      return {
        text: 'Inspección Vencida',
        color: theme.colors.error,
      };
    } else if (daysToInspection <= 7) {
      return {
        text: 'Próxima Inspección',
        color: '#FF9800', // Orange color for upcoming inspection
      };
    } else {
      return {
        text: 'Programada',
        color: '#4CAF50', // Green color for scheduled inspection
      };
    }
  };

  const filterInfrastructures = (infrastructure: Infrastructure) => {
    const matchesSearch = infrastructure.type
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || infrastructure.type === filterType;
    const matchesStatus =
      filterStatus === 'all' || infrastructure.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  };

  const sortInfrastructures = (a: Infrastructure, b: Infrastructure) => {
    switch (sortBy) {
      case 'type': {
        return a.type.localeCompare(b.type);
      }
      case 'status': {
        const statusOrder = {
          critical: 0,
          needs_repair: 1,
          regular: 2,
          good: 3,
        };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      case 'nextInspection': {
        return a.nextInspection.getTime() - b.nextInspection.getTime();
      }
      default:
        return 0;
    }
  };

  const renderInfrastructureCard = (infrastructure: Infrastructure) => {
    const inspectionStatus = getInspectionStatus(infrastructure);

    return (
      <Card
        key={infrastructure.id}
        style={styles.card}
        onPress={() =>
          navigation.navigate('InfrastructureForm', { infrastructure })
        }
      >
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.typeContainer}>
              <IconButton
                icon={getTypeIcon(infrastructure.type)}
                size={24}
                iconColor={theme.colors.primary}
              />
              <Text variant="titleMedium">{getTypeText(infrastructure.type)}</Text>
            </View>
            <Chip
              mode="outlined"
              textStyle={{ color: getStatusColor(infrastructure.status) }}
              style={{ borderColor: getStatusColor(infrastructure.status) }}
            >
              {getStatusText(infrastructure.status)}
            </Chip>
          </View>

          <View style={styles.progressContainer}>
            <ProgressBar
              progress={getStatusProgress(infrastructure.status)}
              color={getStatusColor(infrastructure.status)}
              style={styles.progressBar}
            />
            <Text variant="bodySmall" style={styles.progressText}>
              Estado de Conservación
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.inspectionInfo}>
            <View>
              <Text variant="bodyMedium">Última Inspección</Text>
              <Text variant="bodySmall" style={styles.date}>
                {infrastructure.lastInspection.toLocaleDateString()}
              </Text>
            </View>
            <View>
              <Text variant="bodyMedium">Próxima Inspección</Text>
              <Text variant="bodySmall" style={styles.date}>
                {infrastructure.nextInspection.toLocaleDateString()}
              </Text>
            </View>
            <Chip
              mode="outlined"
              textStyle={{ color: inspectionStatus.color }}
              style={{ borderColor: inspectionStatus.color }}
            >
              {inspectionStatus.text}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Buscar infraestructura"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <IconButton
              icon="sort"
              size={24}
              onPress={() => setSortMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setSortBy('type');
              setSortMenuVisible(false);
            }}
            title="Tipo"
            leadingIcon="shape"
          />
          <Menu.Item
            onPress={() => {
              setSortBy('status');
              setSortMenuVisible(false);
            }}
            title="Estado"
            leadingIcon="alert-circle"
          />
          <Menu.Item
            onPress={() => {
              setSortBy('nextInspection');
              setSortMenuVisible(false);
            }}
            title="Próxima Inspección"
            leadingIcon="calendar"
          />
        </Menu>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={styles.filtersContent}
      >
        <Chip
          selected={filterType === 'all'}
          onPress={() => setFilterType('all')}
          style={styles.filterChip}
        >
          Todos
        </Chip>
        <Chip
          selected={filterType === 'irrigation'}
          onPress={() => setFilterType('irrigation')}
          style={styles.filterChip}
        >
          Riego
        </Chip>
        <Chip
          selected={filterType === 'greenhouse'}
          onPress={() => setFilterType('greenhouse')}
          style={styles.filterChip}
        >
          Invernaderos
        </Chip>
        <Chip
          selected={filterType === 'storage'}
          onPress={() => setFilterType('storage')}
          style={styles.filterChip}
        >
          Almacenes
        </Chip>
      </ScrollView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {infrastructures
          .filter(filterInfrastructures)
          .sort(sortInfrastructures)
          .map(renderInfrastructureCard)}
      </ScrollView>

      <MaintenanceReportDialog
        visible={reportDialogVisible}
        onDismiss={() => setReportDialogVisible(false)}
        infrastructures={infrastructures.filter(filterInfrastructures)}
        onError={(error) => {
          // Handle error (you could show a snackbar or alert here)
          console.error('Report generation error:', error);
        }}
      />

      <FAB.Group
        open={false}
        icon="plus"
        actions={[
          {
            icon: 'file-document',
            label: 'Generar Reporte',
            onPress: () => setReportDialogVisible(true),
          },
          {
            icon: 'plus',
            label: 'Nueva Infraestructura',
            onPress: () => navigation.navigate('InfrastructureForm'),
          },
        ]}
        style={styles.fab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    flex: 1,
    marginRight: 8,
  },
  filters: {
    backgroundColor: '#fff',
    paddingBottom: 8,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    marginTop: 4,
    textAlign: 'center',
    color: '#666',
  },
  divider: {
    marginVertical: 16,
  },
  inspectionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: '#666',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default InfrastructureListScreen;
