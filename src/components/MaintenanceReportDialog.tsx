import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Dialog, TextInput, Button } from 'react-native-paper';
import { reportService } from '../services/reportService';
import type { Infrastructure } from '../types/models';

interface MaintenanceReportDialogProps {
  visible: boolean;
  onDismiss: () => void;
  infrastructures: Infrastructure[];
  onError?: (error: Error) => void;
}

const MaintenanceReportDialog: React.FC<MaintenanceReportDialogProps> = ({
  visible,
  onDismiss,
  infrastructures,
  onError,
}) => {
  const [filename, setFilename] = useState('reporte-mantenimiento');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      await reportService.generateAndShareReport(infrastructures, filename);
      onDismiss();
    } catch (error) {
      console.error('Error generating report:', error);
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
        <Dialog.Title>Generar Reporte de Mantenimiento</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Nombre del archivo"
            value={filename}
            onChangeText={setFilename}
            style={styles.input}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button
            mode="contained"
            onPress={handleGenerate}
            loading={loading}
            disabled={loading || !filename.trim()}
          >
            Generar
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
});

export default MaintenanceReportDialog;
