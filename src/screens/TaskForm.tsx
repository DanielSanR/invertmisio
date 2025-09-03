import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, useTheme, HelperText, SegmentedButtons, Text } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getRealm } from '../services/realm';
import { useTaskNotifications } from '../hooks/useTaskNotifications';
import type { Task } from '../types/models';

interface TaskFormProps {
  route: {
    params: {
      lotId?: string;
      taskId?: string;
      title?: string;
      description?: string;
      dueDate?: string;
      priority?: 'low' | 'medium' | 'high';
      category?: 'treatment' | 'maintenance' | 'harvest' | 'planting' | 'other';
      assignedTo?: string;
      status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
      notes?: string;
      initialDate?: string;
    };
  };
  navigation: any;
}

const TaskForm: React.FC<TaskFormProps> = ({ route, navigation }) => {
  const { updateTaskReminders, cancelTaskReminders } = useTaskNotifications();
  const theme = useTheme();
  const params = route.params || {};

  // Initialize state from route params
  const [title, setTitle] = useState(params.title || '');
  const [description, setDescription] = useState(params.description || '');
  const [dueDate, setDueDate] = useState(
    params.dueDate ? new Date(params.dueDate) :
    params.initialDate ? new Date(params.initialDate) :
    new Date()
  );
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    params.priority || 'medium'
  );
  const [category, setCategory] = useState<'treatment' | 'maintenance' | 'harvest' | 'planting' | 'other'>(
    params.category || 'maintenance'
  );
  const [assignedTo, setAssignedTo] = useState(params.assignedTo || '');
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed' | 'cancelled'>(
    params.status || 'pending'
  );
  const [notes, setNotes] = useState(params.notes || '');
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const priorityLevels = [
    { label: 'Baja', value: 'low' },
    { label: 'Media', value: 'medium' },
    { label: 'Alta', value: 'high' },
  ];

  const categories = [
    { label: 'Tratamiento', value: 'treatment' },
    { label: 'Mantenimiento', value: 'maintenance' },
    { label: 'Cosecha', value: 'harvest' },
    { label: 'Siembra', value: 'planting' },
    { label: 'Otro', value: 'other' },
  ];

  const statusOptions = [
    { label: 'Pendiente', value: 'pending' },
    { label: 'En Progreso', value: 'in_progress' },
    { label: 'Completada', value: 'completed' },
    { label: 'Cancelada', value: 'cancelled' },
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    if (!description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (dueDate < new Date() && status === 'pending') {
      newErrors.dueDate = 'La fecha de vencimiento no puede ser anterior a hoy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const realm = getRealm();
    const taskData = {
      id: params.taskId || new Date().getTime().toString(),
      lotId: params.lotId,
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo: assignedTo || undefined,
      category,
      completedAt: status === 'completed' ? new Date() : undefined,
      notes: notes || undefined,
    };

    try {
      realm.write(() => {
        const task = realm.create('Task', taskData, params.taskId ? 'modified' : 'all');

        if (task.status === 'completed' || task.status === 'cancelled') {
          cancelTaskReminders(task.id);
        } else {
          updateTaskReminders(task);
        }
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Título de la Tarea"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        error={!!errors.title}
      />
      <HelperText type="error" visible={!!errors.title}>
        {errors.title}
      </HelperText>

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={styles.input}
        error={!!errors.description}
      />
      <HelperText type="error" visible={!!errors.description}>
        {errors.description}
      </HelperText>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Categoría
      </Text>
      <SegmentedButtons
        value={category}
        onValueChange={(value: any) => setCategory(value)}
        buttons={categories}
        style={styles.segmentedButtons}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Prioridad
      </Text>
      <SegmentedButtons
        value={priority}
        onValueChange={(value: any) => setPriority(value)}
        buttons={priorityLevels}
        style={styles.segmentedButtons}
      />

      <Button
        mode="outlined"
        onPress={() => setShowDueDatePicker(true)}
        style={styles.input}
      >
        Fecha de Vencimiento: {dueDate.toLocaleDateString()}
      </Button>
      <HelperText type="error" visible={!!errors.dueDate}>
        {errors.dueDate}
      </HelperText>

      <TextInput
        label="Asignado a"
        value={assignedTo}
        onChangeText={setAssignedTo}
        style={styles.input}
      />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Estado
      </Text>
      <SegmentedButtons
        value={status}
        onValueChange={(value: any) => setStatus(value)}
        buttons={statusOptions}
        style={styles.segmentedButtons}
      />

      <TextInput
        label="Notas Adicionales"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      {showDueDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          minimumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDueDatePicker(false);
            if (selectedDate) setDueDate(selectedDate);
          }}
        />
      )}

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
    marginBottom: 8,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 8,
    marginTop: 16,
    marginBottom: 32,
  },
  button: {
    marginTop: 8,
  },
});

export default TaskForm;
