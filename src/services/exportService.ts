import RNFS from 'react-native-fs';
import { Platform, Share } from 'react-native';
import XLSX from 'xlsx';
import { Buffer } from 'buffer';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import type { Task } from '../types/models';

// Define export directory
const EXPORT_DIR = `${RNFS.DocumentDirectoryPath}/exports`;

// Ensure export directory exists
const ensureExportDir = async () => {
  const exists = await RNFS.exists(EXPORT_DIR);
  if (!exists) {
    await RNFS.mkdir(EXPORT_DIR);
  }
};

// Get status text in Spanish
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

// Get priority text in Spanish
const getPriorityText = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return 'Alta';
    case 'medium':
      return 'Media';
    case 'low':
      return 'Baja';
    default:
      return priority;
  }
};

// Get category text in Spanish
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

// Generate Excel file
const exportToExcel = async (tasks: Task[], filename = 'tareas'): Promise<string> => {
  await ensureExportDir();

  // Prepare data for Excel
  const data = tasks.map(task => ({
    'Título': task.title,
    'Descripción': task.description || '',
    'Estado': getStatusText(task.status),
    'Prioridad': getPriorityText(task.priority),
    'Categoría': getCategoryText(task.category),
    'Fecha de Vencimiento': task.dueDate.toLocaleDateString(),
    'Asignado a': task.assignedTo || 'No asignado',
    'Fecha de Completado': task.completedAt ? task.completedAt.toLocaleDateString() : '',
    'Notas': task.notes || '',
  }));

  // Create workbook
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tareas');

  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
  const filePath = `${EXPORT_DIR}/${filename}.xlsx`;
  await RNFS.writeFile(filePath, excelBuffer, 'base64');

  return filePath;
};

// Generate PDF file
const exportToPDF = async (tasks: Task[], filename = 'tareas'): Promise<string> => {
  await ensureExportDir();

  // Generate HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .task-title { font-weight: bold; }
          .priority-high { color: #d32f2f; }
          .priority-medium { color: #f57c00; }
          .priority-low { color: #388e3c; }
          .header { text-align: center; margin-bottom: 20px; }
          .date { font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Reporte de Tareas</h1>
          <p class="date">Generado el ${new Date().toLocaleDateString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Tarea</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Categoría</th>
              <th>Vencimiento</th>
              <th>Asignado a</th>
            </tr>
          </thead>
          <tbody>
            ${tasks.map(task => `
              <tr>
                <td>
                  <div class="task-title">${task.title}</div>
                  ${task.description ? `<div>${task.description}</div>` : ''}
                </td>
                <td>${getStatusText(task.status)}</td>
                <td class="priority-${task.priority}">${getPriorityText(task.priority)}</td>
                <td>${getCategoryText(task.category)}</td>
                <td>${task.dueDate.toLocaleDateString()}</td>
                <td>${task.assignedTo || 'No asignado'}</td>
              </tr>
              ${task.notes ? `
                <tr>
                  <td colspan="6">
                    <strong>Notas:</strong> ${task.notes}
                  </td>
                </tr>
              ` : ''}
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  // Generate PDF file
  const options = {
    html: htmlContent,
    fileName: filename,
    directory: 'Documents/exports',
  };

  const pdf = await RNHTMLtoPDF.convert(options);
  return pdf.filePath;
};

// Share exported file
const shareFile = async (filePath: string, type: 'excel' | 'pdf') => {
  try {
    const extension = type === 'excel' ? 'xlsx' : 'pdf';
    const mimeType = type === 'excel' 
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'application/pdf';

    if (Platform.OS === 'ios') {
      await Share.share({
        url: filePath,
        type: mimeType,
      });
    } else {
      await Share.share({
        title: `Tareas.${extension}`,
        message: filePath,
      });
    }
  } catch (error) {
    console.error('Error sharing file:', error);
    throw error;
  }
};

// Export tasks with specified format
const exportTasks = async (
  tasks: Task[],
  format: 'excel' | 'pdf',
  filename?: string
): Promise<void> => {
  try {
    let filePath: string;

    if (format === 'excel') {
      filePath = await exportToExcel(tasks, filename);
    } else {
      filePath = await exportToPDF(tasks, filename);
    }

    await shareFile(filePath, format);

    // Clean up the file after sharing
    await RNFS.unlink(filePath);
  } catch (error) {
    console.error('Error exporting tasks:', error);
    throw error;
  }
};

// Clean up export directory
const cleanupExports = async () => {
  try {
    const exists = await RNFS.exists(EXPORT_DIR);
    if (exists) {
      await RNFS.unlink(EXPORT_DIR);
    }
  } catch (error) {
    console.error('Error cleaning up exports:', error);
  }
};

export const exportService = {
  exportTasks,
  cleanupExports,
};

export default exportService;
