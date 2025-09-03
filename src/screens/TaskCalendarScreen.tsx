import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Card, Text, useTheme, List, FAB, Chip } from 'react-native-paper';
import { getRealm } from '../services/realm';
import type { Task } from '../types/models';

interface TaskCalendarScreenProps {
  navigation: any;
}

interface MarkedDates {
  [date: string]: {
    marked?: boolean;
    dots?: Array<{ color: string }>;
    selected?: boolean;
  };
}

const TaskCalendarScreen: React.FC<TaskCalendarScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const realm = getRealm();
    const realmTasks = realm.objects<Task>('Task').sorted('dueDate');
    setTasks([...realmTasks]);
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

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return '#FF9800'; // Orange color for medium priority
      case 'low':
        return '#4CAF50'; // Green color for low priority
      default:
        return theme.colors.primary;
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

  const markedDates: MarkedDates = useMemo(() => {
    const dates: MarkedDates = {};
    
    // Mark selected date
    dates[selectedDate] = {
      selected: true,
      dots: [],
    };

    // Add dots for tasks
    tasks.forEach(task => {
      const date = task.dueDate.toISOString().split('T')[0];
      if (!dates[date]) {
        dates[date] = {
          dots: [],
        };
      }
      dates[date].dots?.push({
        color: getPriorityColor(task.priority),
      });
      dates[date].marked = true;
    });

    return dates;
  }, [tasks, selectedDate, theme.colors]);

  const selectedDateTasks = useMemo(() => {
    return tasks.filter(task => {
      const taskDate = task.dueDate.toISOString().split('T')[0];
      return taskDate === selectedDate;
    }).sort((a, b) => {
      // Sort by priority (high -> medium -> low)
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [tasks, selectedDate]);

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskForm', {
      taskId: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.toISOString(),
      priority: task.priority,
      category: task.category,
      status: task.status,
      assignedTo: task.assignedTo,
      lotId: task.lotId,
      notes: task.notes,
      completedAt: task.completedAt?.toISOString(),
    });
  };

  const renderTaskItem = (task: Task) => (
    <Card
      key={task.id}
      style={[styles.taskCard, { borderLeftColor: getPriorityColor(task.priority) }]}
      onPress={() => handleTaskPress(task)}
    >
      <Card.Content>
        <View style={styles.taskHeader}>
          <List.Icon icon={getCategoryIcon(task.category)} />
          <View style={styles.taskTitleContainer}>
            <Text variant="titleMedium" numberOfLines={1}>
              {task.title}
            </Text>
            <Chip
              icon="information"
              compact
              mode="outlined"
              style={[
                styles.statusChip,
                { backgroundColor: getStatusColor(task.status) + '20' },
              ]}
              textStyle={{ color: getStatusColor(task.status) }}
            >
              {task.status}
            </Chip>
          </View>
        </View>
        
        {task.description && (
          <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
            {task.description}
          </Text>
        )}

        {task.assignedTo && (
          <Text variant="bodySmall" style={styles.assignee}>
            Asignado a: {task.assignedTo}
          </Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        markingType="multi-dot"
        theme={{
          selectedDayBackgroundColor: theme.colors.primary,
          todayTextColor: theme.colors.primary,
          dotColor: theme.colors.primary,
          arrowColor: theme.colors.primary,
        }}
      />

      <View style={styles.taskList}>
        <Text variant="titleMedium" style={styles.dateHeader}>
          {new Date(selectedDate).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        <ScrollView style={styles.taskScroll}>
          {selectedDateTasks.length > 0 ? (
            selectedDateTasks.map(renderTaskItem)
          ) : (
            <Text variant="bodyMedium" style={styles.noTasks}>
              No hay tareas programadas para este día
            </Text>
          )}
        </ScrollView>
      </View>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('TaskForm', { initialDate: new Date(selectedDate) })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  taskList: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
  },
  dateHeader: {
    padding: 16,
    textTransform: 'capitalize',
  },
  taskScroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  taskCard: {
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    marginTop: 8,
  },
  assignee: {
    marginTop: 8,
    color: '#666',
  },
  statusChip: {
    height: 24,
  },
  noTasks: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default TaskCalendarScreen;
