import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import {
  Searchbar,
  List,
  Chip,
  FAB,
  Text,
  useTheme,
  Menu,
  Divider,
  IconButton,
  Card,
  Portal,
  Dialog,
  Button,
} from 'react-native-paper';
import TaskExportDialog from '../components/TaskExportDialog';
import { mockApiService } from '../services/mockApiService';
import type { Task } from '../types/models';

interface TaskListScreenProps {
  navigation: any;
}

type SortOption = 'dueDate' | 'priority' | 'status' | 'category';
type FilterStatus = 'all' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
type FilterPriority = 'all' | 'low' | 'medium' | 'high';
type FilterCategory =
  | 'all'
  | 'treatment'
  | 'maintenance'
  | 'harvest'
  | 'planting'
  | 'other';

const TaskListScreen: React.FC<TaskListScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasksData = await mockApiService.getTasks();
      // Sort by due date (simulating Realm's sorted functionality)
      const sortedTasks = tasksData.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return theme.colors.error;
      case 'in_progress':
        return theme.colors.primary;
      case 'completed':
        return '#4CAF50'; // Green color for completed
      case 'cancelled':
        return theme.colors.onSurfaceVariant;
      default:
        return theme.colors.onSurface;
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'flag';
      case 'medium':
        return 'flag-outline';
      case 'low':
        return 'flag-variant-outline';
      default:
        return 'flag-outline';
    }
  };

  const getCategoryIcon = (category: Task['category']) => {
    switch (category) {
      case 'treatment':
        return 'spray';
      case 'maintenance':
        return 'tools';
      case 'harvest':
        return 'fruit-cherries';
      case 'planting':
        return 'seed';
      default:
        return 'format-list-bulleted';
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in_progress':
        return 'En Progreso';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getCategoryText = (category: Task['category']) => {
    switch (category) {
      case 'treatment':
        return 'Tratamiento';
      case 'maintenance':
        return 'Mantenimiento';
      case 'harvest':
        return 'Cosecha';
      case 'planting':
        return 'Siembra';
      case 'other':
        return 'Otro';
      default:
        return category;
    }
  };

  const filterTasks = (task: Task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority =
      filterPriority === 'all' || task.priority === filterPriority;
    const matchesCategory =
      filterCategory === 'all' || task.category === filterCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  };

  const sortTasks = (a: Task, b: Task) => {
    switch (sortBy) {
      case 'dueDate':
        return a.dueDate.getTime() - b.dueDate.getTime();
      case 'priority': {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      case 'status': {
        const statusOrder = {
          in_progress: 0,
          pending: 1,
          completed: 2,
          cancelled: 3,
        };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      case 'category': {
        const categoryOrder = {
          treatment: 0,
          maintenance: 1,
          harvest: 2,
          planting: 3,
          other: 4,
        };
        return categoryOrder[a.category] - categoryOrder[b.category];
      }
      default:
        return 0;
    }
  };

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskForm', {
      taskId: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.toISOString(),
      priority: task.priority,
      category: task.category,
      assignedTo: task.assignedTo,
      status: task.status,
      notes: task.notes,
      lotId: task.lotId
    });
  };

  const renderTaskItem = ({ item: task }: { item: Task }) => (
    <Card
      style={styles.taskCard}
      onPress={() => handleTaskPress(task)}
      mode="outlined"
    >
      <Card.Content>
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleContainer}>
            <IconButton
              icon={getPriorityIcon(task.priority)}
              size={20}
              iconColor={getStatusColor(task.status)}
              style={styles.priorityIcon}
            />
            <Text variant="titleMedium" numberOfLines={1} style={styles.taskTitle}>
              {task.title}
            </Text>
          </View>
          <IconButton
            icon={getCategoryIcon(task.category)}
            size={20}
            iconColor={theme.colors.primary}
          />
        </View>

        <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
          {task.description}
        </Text>

        <View style={styles.taskFooter}>
          <Chip
            icon="calendar"
            compact
            mode="outlined"
            style={styles.chip}
          >
            {task.dueDate.toLocaleDateString()}
          </Chip>
          <Chip
            icon="account"
            compact
            mode="outlined"
            style={styles.chip}
          >
            {task.assignedTo || 'Sin asignar'}
          </Chip>
          <Chip
            icon="information"
            compact
            mode="outlined"
            style={[
              styles.chip,
              { backgroundColor: getStatusColor(task.status) + '20' },
            ]}
            textStyle={{ color: getStatusColor(task.status) }}
          >
            {getStatusText(task.status)}
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Buscar tareas"
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
              setSortBy('dueDate');
              setSortMenuVisible(false);
            }}
            title="Fecha de vencimiento"
            leadingIcon="calendar"
          />
          <Menu.Item
            onPress={() => {
              setSortBy('priority');
              setSortMenuVisible(false);
            }}
            title="Prioridad"
            leadingIcon="flag"
          />
          <Menu.Item
            onPress={() => {
              setSortBy('status');
              setSortMenuVisible(false);
            }}
            title="Estado"
            leadingIcon="information"
          />
          <Menu.Item
            onPress={() => {
              setSortBy('category');
              setSortMenuVisible(false);
            }}
            title="Categoría"
            leadingIcon="shape"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setSortMenuVisible(false);
              setExportDialogVisible(true);
            }}
            title="Exportar Tareas"
            leadingIcon="file-export"
          />
        </Menu>
      </View>

      <View style={styles.filters}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          <Chip
            selected={filterStatus === 'all'}
            onPress={() => setFilterStatus('all')}
            style={styles.filterChip}
          >
            Todos
          </Chip>
          <Chip
            selected={filterStatus === 'pending'}
            onPress={() => setFilterStatus('pending')}
            style={styles.filterChip}
          >
            Pendientes
          </Chip>
          <Chip
            selected={filterStatus === 'in_progress'}
            onPress={() => setFilterStatus('in_progress')}
            style={styles.filterChip}
          >
            En Progreso
          </Chip>
          <Chip
            selected={filterStatus === 'completed'}
            onPress={() => setFilterStatus('completed')}
            style={styles.filterChip}
          >
            Completadas
          </Chip>
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          <Chip
            selected={filterCategory === 'all'}
            onPress={() => setFilterCategory('all')}
            style={styles.filterChip}
          >
            Todas las Categorías
          </Chip>
          <Chip
            selected={filterCategory === 'treatment'}
            onPress={() => setFilterCategory('treatment')}
            style={styles.filterChip}
          >
            Tratamientos
          </Chip>
          <Chip
            selected={filterCategory === 'maintenance'}
            onPress={() => setFilterCategory('maintenance')}
            style={styles.filterChip}
          >
            Mantenimiento
          </Chip>
          <Chip
            selected={filterCategory === 'harvest'}
            onPress={() => setFilterCategory('harvest')}
            style={styles.filterChip}
          >
            Cosecha
          </Chip>
          <Chip
            selected={filterCategory === 'planting'}
            onPress={() => setFilterCategory('planting')}
            style={styles.filterChip}
          >
            Siembra
          </Chip>
        </ScrollView>
      </View>

      <FlatList
        data={tasks.filter(filterTasks).sort(sortTasks)}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      <TaskExportDialog
        visible={exportDialogVisible}
        onDismiss={() => setExportDialogVisible(false)}
        tasks={tasks.filter(filterTasks)}
        onError={(error) => {
          // Handle error (you could show a snackbar or alert here)
          console.error('Export error:', error);
        }}
      />

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('TaskForm')}
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
  listContent: {
    padding: 16,
  },
  taskCard: {
    marginBottom: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityIcon: {
    margin: 0,
    marginRight: 4,
  },
  taskTitle: {
    flex: 1,
  },
  description: {
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    height: 28,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default TaskListScreen;
