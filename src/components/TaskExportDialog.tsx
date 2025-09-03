import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Portal, Dialog, RadioButton, Text, Button, TextInput } from 'react-native-paper';
import { exportService } from '../services/exportService';
import type { Task } from '../types/models';

interface TaskExportDialogProps {
  visible: boolean;
  onDismiss: () => void;
  tasks: Task[];
  onError?: (error: Error) => void;
}

const TaskExportDialog: React.FC<TaskExportDialogProps> = ({
  visible,
  onDismiss,
  tasks,
  onError,
}) => {
  const [format, setFormat] = useState<'excel' | 'pdf'>('excel');
  const [filename, setFilename] = useState('tareas');
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      await exportService.exportTasks(tasks, format, filename);
      onDismiss();
    } catch (error) {
      console.error('Error exporting tasks:', error);
      if (onError) {
        onError(error as Error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Exportar Tareas</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Nombre del archivo"
            value={filename}
            onChangeText={setFilename}
            style={styles.input}
          />

          <Text variant="bodyMedium" style={styles.label}>
            Formato de exportación
          </Text>

          <RadioButton.Group onValueChange={value => setFormat(value as 'excel' | 'pdf')} value={format}>
            <View style={styles.radioOption}>
              <RadioButton value="excel" />
              <Text>Excel (.xlsx)</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="pdf" />
              <Text>PDF (.pdf)</Text>
            </View>
          </RadioButton.Group>

          <Text variant="bodySmall" style={styles.info}>
            Se exportarán {tasks.length} tareas
          </Text>
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button
            mode="contained"
            onPress={handleExport}
            loading={loading}
            disabled={loading || !filename.trim()}
          >
            Exportar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  info: {
    marginTop: 16,
    color: '#666',
  },
});

export default TaskExportDialog;
