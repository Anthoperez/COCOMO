import { jsPDF } from 'jspdf';

type EstimationResult = {
  esf: number;
  tdes: number;
  costo: number;
  n: number;
  productividad: number;
};

type DriverEntry = {
  label: string;
  selectedValue: string;
  factorValue: number | null;
};

type StageBreakdownItem = {
  label: string;
  percentage: number;
  cost: number;
};

interface ReportPayload {
  title: string;
  subtitle?: string;
  formData: {
    kdlc: number;
    cpm: number;
    mode?: string;
  };
  estimationResult: EstimationResult;
  costDrivers?: DriverEntry[];
  scaleDrivers?: DriverEntry[];
  stageBreakdown?: StageBreakdownItem[];
  stagesEnabled?: boolean;
}

const formatNumber = (value: number) => Number(value).toFixed(2);

const addWrappedText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  pageHeight: number,
  margin: number,
  lineHeightFactor = 1.15
) => {
  const lines = doc.splitTextToSize(text, maxWidth);
  const fontSize = doc.getFontSize();
  const lineHeight = fontSize * lineHeightFactor;
  const needed = lines.length * lineHeight;
  if (y + needed > pageHeight - margin) {
    doc.addPage();
    y = margin;
  }
  doc.text(lines, x, y);
  return y + needed;
};

const addSectionTitle = (doc: jsPDF, text: string, y: number, pageHeight: number, margin: number) => {
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  const fontSize = doc.getFontSize();
  const needed = fontSize * 1.4;
  if (y + needed > pageHeight - margin) {
    doc.addPage();
    y = margin;
  }
  doc.text(text, 14, y);
  return y + needed;
};

export const downloadEstimationReport = (payload: ReportPayload) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  let y = 40;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(payload.title, margin, y);
  y += 18;

  if (payload.subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(payload.subtitle, margin, y);
    y += 16;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Generado el ${new Date().toLocaleString('es-ES')}`, margin, y);
  y += 16;

  y = addSectionTitle(doc, 'Datos ingresados', y, pageHeight, margin);
  y += 6;
  doc.setFontSize(10);
  y = addWrappedText(doc, `KDLC: ${formatNumber(payload.formData.kdlc)}`, margin, y, contentWidth, pageHeight, margin);
  y = addWrappedText(doc, `CPM: ${formatNumber(payload.formData.cpm)}`, margin, y, contentWidth, pageHeight, margin);
  if (payload.formData.mode) {
    y = addWrappedText(doc, `Modo: ${payload.formData.mode}`, margin, y, contentWidth, pageHeight, margin);
  }

  if (payload.costDrivers && payload.costDrivers.length > 0) {
    y += 6;
    y = addSectionTitle(doc, 'Multiplicadores de costo', y, pageHeight, margin);
    y += 4;
    doc.setFontSize(9);
    payload.costDrivers.forEach((driver) => {
      const text = `${driver.label}: ${driver.selectedValue} (factor ${driver.factorValue ?? 'N/A'})`;
      y = addWrappedText(doc, text, margin + 8, y, contentWidth - 16, pageHeight, margin, 1.1);
    });
    doc.setFontSize(10);
  }

  if (payload.scaleDrivers && payload.scaleDrivers.length > 0) {
    y += 6;
    y = addSectionTitle(doc, 'Factores de escala', y, pageHeight, margin);
    y += 4;
    doc.setFontSize(9);
    payload.scaleDrivers.forEach((driver) => {
      const text = `${driver.label}: ${driver.selectedValue} (factor ${driver.factorValue ?? 'N/A'})`;
      y = addWrappedText(doc, text, margin + 8, y, contentWidth - 16, pageHeight, margin, 1.1);
    });
    doc.setFontSize(10);
  }

  if (payload.stagesEnabled && payload.stageBreakdown && payload.stageBreakdown.length > 0) {
    y += 6;
    y = addSectionTitle(doc, 'Distribución por etapas', y, pageHeight, margin);
    y += 4;
    payload.stageBreakdown.forEach((stage) => {
      const text = `${stage.label}: ${(stage.percentage * 100).toFixed(2)}% - S/ ${formatNumber(stage.cost)}`;
      y = addWrappedText(doc, text, margin + 8, y, contentWidth - 16, pageHeight, margin);
    });
  }

  if (pageHeight - y < 120) {
    doc.addPage();
    y = margin;
  }

  y = addSectionTitle(doc, 'Resultados de la estimación', y, pageHeight, margin);
  y += 6;
  y = addWrappedText(doc, `ESF: ${formatNumber(payload.estimationResult.esf)} Personas-Mes`, margin, y, contentWidth, pageHeight, margin);
  y = addWrappedText(doc, `TDES: ${formatNumber(payload.estimationResult.tdes)} Meses`, margin, y, contentWidth, pageHeight, margin);
  y = addWrappedText(doc, `Trabajadores: ${formatNumber(payload.estimationResult.n)} Personas`, margin, y, contentWidth, pageHeight, margin);
  y = addWrappedText(doc, `Productividad: ${formatNumber(payload.estimationResult.productividad)} KLDC/Personas-Mes`, margin, y, contentWidth, pageHeight, margin);
  y = addWrappedText(doc, `Costo total: S/ ${formatNumber(payload.estimationResult.costo)}`, margin, y, contentWidth, pageHeight, margin);

  const fileName = `${payload.title.toLowerCase().replace(/\s+/g, '-')}-reporte.pdf`;
  doc.save(fileName);
};
