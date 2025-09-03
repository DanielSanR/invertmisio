import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, AgendaList, CalendarProvider, ExpandableCalendar } from 'react-native-calendars';
import { Card, Text, useTheme, FAB, Chip, IconButton } from 'react-native-paper';
import { getRealm } from '../services/realm';
import type { Task } from '../types/models';

interface TaskScheduleScreenProps {
  navigation: any;
}

interface MarkedDates {
  [date: string]: {
    marked?: boolean;
    dots?: Array<{ color: string }>;
    selected?: boolean;
  };
}

const TaskScheduleScreen: React.FC<TaskScheduleScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const realm = getRealm();
    const realmTasks = realm.objects<Task>('Task').sorted('dueDate');
    setTasks([...realmTasks]);
    updateMarkedDates([...realmTasks]);
  };

  const updateMarkedDates = (taskList: Task[]) => {
    const marked: MarkedDates = {};
    taskList.forEach(task => {
      const date = task.dueDate.toISOString().split('T')[0];
      if (!marked[date]) {
        marked[date] = {
          dots: [],
          marked: true
        };
      }

      const dotColor = getPriorityColor(task.priority);
      marked[date].dots?.push({ color: dotColor });
    });

    // Mark selected date
    if (marked[selectedDate]) {
      marked[selectedDate].selected = true;
    } else {
      marked[selectedDate] = { selected: true };
    }

    setMarkedDates(marked);
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

  const renderTask = (task: Task) => {
    return (
      <Card
        key={task.id}
        style={[styles.taskCard, { borderLeftColor: getPriorityColor(task.priority) }]}
        onPress={() => navigation.navigate('TaskForm', {
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
        })}
      >
        <Card.Content>
          <View style={styles.taskHeader}>
            <IconButton
              icon={getCategoryIcon(task.category)}
              size={24}
              iconColor={theme.colors.primary}
            />
            <View style={styles.taskInfo}>
              <Text variant="titleMedium">{task.title}</Text>
              <Text variant="bodySmall" style={styles.taskTime}>
                {task.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <Chip
              mode="outlined"
              textStyle={{ color: getStatusColor(task.status) }}
              style={{ borderColor: getStatusColor(task.status) }}
            >
              {task.status}
            </Chip>
          </View>
          
          {task.description && (
            <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
              {task.description}
            </Text>
          )}

          <View style={styles.taskFooter}>
            {task.assignedTo && (
              <Chip icon="account" compact mode="outlined">
                {task.assignedTo}
              </Chip>
            )}
            <Chip icon="flag" compact mode="outlined" style={{ marginLeft: 8 }}>
              {task.priority}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const getTasksForDate = (date: string) => {
    return tasks.filter(task => 
      task.dueDate.toISOString().split('T')[0] === date
    ).sort((a, b) => {
      // Sort by priority first
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by time
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  };

  return (
    <View style={styles.container}>
      <CalendarProvider
        date={selectedDate}
        onDateChanged={date => setSelectedDate(date)}
      >
        <ExpandableCalendar
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: theme.colors.primary,
            todayTextColor: theme.colors.primary,
            dotColor: theme.colors.primary,
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

          <AgendaList
            sections={[{ title: selectedDate, data: getTasksForDate(selectedDate) }]}
            renderItem={({ item }) => renderTask(item as Task)}
            sectionStyle={styles.section}
          />
        </View>
      </CalendarProvider>

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
  section: {
    backgroundColor: 'transparent',
  },
  taskCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
    marginRight: 8,
  },
  taskTime: {
    color: '#666',
    marginTop: 2,
  },
  description: {
    marginTop: 8,
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default TaskScheduleScreen;
