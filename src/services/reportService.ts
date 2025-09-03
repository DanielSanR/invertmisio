import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { Platform, Share } from 'react-native';
import type { Infrastructure } from '../types/models';

const REPORTS_DIR = `${RNFS.DocumentDirectoryPath}/reports`;

// Ensure reports directory exists
const ensureReportsDir = async () => {
  const exists = await RNFS.exists(REPORTS_DIR);
  if (!exists) {
    await RNFS.mkdir(REPORTS_DIR);
  }
};

// Get status text in Spanish
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

// Get type text in Spanish
const getTypeText = (type: Infrastructure['type']) => {
  switch (type) {
    case 'irrigation':
      return 'Sistema de Riego';
    case 'greenhouse':
      return 'Invernadero';
    case 'storage':
      return 'Almacén';
    case 'other':
      return 'Otro';
    default:
      return type;
  }
};

// Calculate days between inspections
const getDaysBetweenInspections = (infrastructure: Infrastructure) => {
  return Math.round(
    (infrastructure.nextInspection.getTime() - infrastructure.lastInspection.getTime()) /
    (1000 * 60 * 60 * 24)
  );
};

// Calculate days until next inspection
const getDaysUntilNextInspection = (infrastructure: Infrastructure) => {
  const today = new Date();
  return Math.round(
    (infrastructure.nextInspection.getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24)
  );
};

// Generate maintenance status report
const generateMaintenanceReport = async (
  infrastructures: Infrastructure[],
  filename = 'reporte-mantenimiento'
): Promise<string> => {
  await ensureReportsDir();

  // Group infrastructures by type
  const groupedByType = infrastructures.reduce((acc, curr) => {
    if (!acc[curr.type]) {
      acc[curr.type] = [];
    }
    acc[curr.type].push(curr);
    return acc;
  }, {} as Record<Infrastructure['type'], Infrastructure[]>);

  // Calculate statistics
  const totalCount = infrastructures.length;
  const criticalCount = infrastructures.filter(i => i.status === 'critical').length;
  const needsRepairCount = infrastructures.filter(i => i.status === 'needs_repair').length;
  const overdueInspections = infrastructures.filter(i => getDaysUntilNextInspection(i) < 0).length;

  // Generate HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .summary { 
            background-color: #f5f5f5; 
            padding: 20px; 
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .status-critical { color: #d32f2f; }
          .status-needs-repair { color: #f57c00; }
          .status-regular { color: #fbc02d; }
          .status-good { color: #388e3c; }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
            margin-bottom: 30px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: left; 
          }
          th { background-color: #f5f5f5; }
          .section { margin-bottom: 40px; }
          .chart {
            width: 100%;
            height: 20px;
            background-color: #f5f5f5;
            border-radius: 10px;
            margin: 10px 0;
          }
          .chart-bar {
            height: 100%;
            border-radius: 10px;
            background-color: #4caf50;
          }
          .notes { font-style: italic; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Reporte de Mantenimiento de Infraestructura</h1>
          <p>Generado el ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="summary">
          <h2>Resumen General</h2>
          <p>Total de Infraestructuras: ${totalCount}</p>
          <p class="status-critical">En Estado Crítico: ${criticalCount}</p>
          <p class="status-needs-repair">Necesitan Reparación: ${needsRepairCount}</p>
          <p>Inspecciones Vencidas: ${overdueInspections}</p>
        </div>

        ${Object.entries(groupedByType).map(([type, items]) => `
          <div class="section">
            <h2>${getTypeText(type as Infrastructure['type'])}</h2>
            <table>
              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Última Inspección</th>
                  <th>Próxima Inspección</th>
                  <th>Días Restantes</th>
                  <th>Intervalo</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => {
                  const daysUntil = getDaysUntilNextInspection(item);
                  const interval = getDaysBetweenInspections(item);
                  const statusClass = item.status === 'critical' 
                    ? 'status-critical' 
                    : item.status === 'needs_repair'
                    ? 'status-needs-repair'
                    : item.status === 'regular'
                    ? 'status-regular'
                    : 'status-good';
                  
                  return `
                    <tr>
                      <td class="${statusClass}">${getStatusText(item.status)}</td>
                      <td>${item.lastInspection.toLocaleDateString()}</td>
                      <td>${item.nextInspection.toLocaleDateString()}</td>
                      <td>${daysUntil} días</td>
                      <td>${interval} días</td>
                    </tr>
                    ${item.notes ? `
                      <tr>
                        <td colspan="5" class="notes">
                          <strong>Notas:</strong> ${item.notes}
                        </td>
                      </tr>
                    ` : ''}
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}

        <div class="section">
          <h2>Distribución de Estados</h2>
          <div>
            <p>Estado Crítico (${(criticalCount / totalCount * 100).toFixed(1)}%)</p>
            <div class="chart">
              <div class="chart-bar status-critical" style="width: ${criticalCount / totalCount * 100}%"></div>
            </div>
          </div>
          <div>
            <p>Necesita Reparación (${(needsRepairCount / totalCount * 100).toFixed(1)}%)</p>
            <div class="chart">
              <div class="chart-bar status-needs-repair" style="width: ${needsRepairCount / totalCount * 100}%"></div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  // Generate PDF
  const options = {
    html: htmlContent,
    fileName: filename,
    directory: 'Documents/reports',
  };

  const pdf = await RNHTMLtoPDF.convert(options);
  return pdf.filePath;
};

// Share report file
const shareReport = async (filePath: string) => {
  try {
    if (Platform.OS === 'ios') {
      await Share.share({
        url: filePath,
        type: 'application/pdf',
      });
    } else {
      await Share.share({
        title: 'Reporte de Mantenimiento.pdf',
        message: filePath,
      });
    }
  } catch (error) {
    console.error('Error sharing report:', error);
    throw error;
  }
};

// Generate and share maintenance report
const generateAndShareReport = async (
  infrastructures: Infrastructure[],
  filename?: string
): Promise<void> => {
  try {
    const filePath = await generateMaintenanceReport(infrastructures, filename);
    await shareReport(filePath);
    await RNFS.unlink(filePath);
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

// Clean up reports directory
const cleanupReports = async () => {
  try {
    const exists = await RNFS.exists(REPORTS_DIR);
    if (exists) {
      await RNFS.unlink(REPORTS_DIR);
    }
  } catch (error) {
    console.error('Error cleaning up reports:', error);
  }
};

export const reportService = {
  generateMaintenanceReport,
  generateAndShareReport,
  cleanupReports,
};

export default reportService;
