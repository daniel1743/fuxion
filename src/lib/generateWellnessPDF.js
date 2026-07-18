import { jsPDF } from 'jspdf';

const DOMAIN_LABELS = {
  nutrition: 'Nutrición e Hidratación',
  activity: 'Actividad Física',
  sleep: 'Calidad del Sueño',
  mental: 'Salud Mental y Estrés',
  biometry: 'Biometría y Riesgo',
  digestion: 'Salud Digestiva',
  habits: 'Hábitos y Prevención',
};

export async function generateWellnessPDF(userData, planResults) {
  const doc = new jsPDF();
  
  // Helpers
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = margin;

  const checkPage = (heightNeeded) => {
    if (y + heightNeeded > pageHeight - 30) {
      doc.addPage();
      y = margin;
    }
  };

  const addFooter = () => {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      const footerY = pageHeight - 20;
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 100, 100);
      doc.text('Bienestar en Claro', margin, footerY);
      
      doc.setFont('helvetica', 'normal');
      doc.text('WhatsApp: +56 989 63 90 88 | Instagram: @donde_mi_negro', margin, footerY + 5);
      
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('© 2026 Bienestar en Claro. Todos los derechos reservados.', margin, footerY + 10);
      doc.text('Este documento tiene fines exclusivamente informativos y no constituye un diagnóstico médico.', margin, footerY + 14);
    }
  };

  // 1. Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(34, 197, 94); // #22c55e
  doc.text('BIENESTAR EN CLARO', pageWidth / 2, y, { align: 'center' });
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('Tu Plan de Bienestar Personalizado', pageWidth / 2, y, { align: 'center' });
  y += 6;

  // Decorative line
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(1);
  doc.line(margin, y, pageWidth - margin, y);
  y += 12;

  // 2. Personal Data Section
  const dateStr = new Date(planResults.last_evaluation || Date.now()).toLocaleDateString('es-CL');
  const genderStr = userData.gender === 'male' ? 'Masculino' : userData.gender === 'female' ? 'Femenino' : userData.gender;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Datos Personales', margin, y);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Fecha: ${dateStr}`, pageWidth - margin, y, { align: 'right' });
  y += 8;

  doc.setTextColor(60, 60, 60);
  doc.text(`Nombre: ${userData.name}`, margin, y);
  doc.text(`Edad: ${userData.age} años`, margin + 80, y);
  y += 6;
  doc.text(`Género: ${genderStr}`, margin, y);
  doc.text(`Peso: ${userData.weight} kg`, margin + 80, y);
  y += 6;
  doc.text(`Estatura: ${userData.height} cm`, margin, y);
  doc.text(`Cintura: ${userData.waistCm || '--'} cm`, margin + 80, y);
  y += 6;
  doc.text(`IMC: ${planResults.twin_state.biometrics.bmi} - ${planResults.twin_state.biometrics.bmiClass}`, margin, y);
  y += 12;

  // 3. IIB Score Section
  checkPage(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(34, 197, 94);
  doc.text('ÍNDICE INTEGRAL DE BIENESTAR', margin, y);
  y += 10;

  doc.setFontSize(28);
  doc.setTextColor(40, 40, 40);
  doc.text(`${planResults.twin_state.iib.score}/100`, margin, y);
  
  doc.setFontSize(14);
  doc.setTextColor(34, 197, 94);
  doc.text(`Nivel: ${planResults.twin_state.iib.level}`, margin + 50, y - 4);
  
  y += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  const iibDesc = doc.splitTextToSize(
    'Este puntaje refleja tu estado general de bienestar actual basado en múltiples dimensiones de salud. A continuación se desglosa el resultado por área.', 
    pageWidth - 2 * margin
  );
  doc.text(iibDesc, margin, y);
  y += iibDesc.length * 5 + 6;

  // 4. Domain Scores
  checkPage(60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);
  doc.text('Desglose por Dominios:', margin, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const col1X = margin + 5;
  const col2X = margin + 90;
  
  let i = 0;
  for (const [key, label] of Object.entries(DOMAIN_LABELS)) {
    if (planResults.twin_state.domains && planResults.twin_state.domains[key] !== undefined) {
      const score = planResults.twin_state.domains[key];
      const x = i % 2 === 0 ? col1X : col2X;
      
      doc.setTextColor(60, 60, 60);
      doc.text(`${label}:`, x, y);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(34, 197, 94);
      doc.text(`${score}/100`, x + 50, y);
      doc.setFont('helvetica', 'normal');
      
      if (i % 2 !== 0) y += 8;
      i++;
    }
  }
  if (i % 2 !== 0) y += 8;
  y += 8;

  // 5. Recommendations Section
  checkPage(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(34, 197, 94);
  doc.text('TUS 3 MICROHÁBITOS PRIORITARIOS', margin, y);
  y += 10;

  if (planResults.recommendations) {
    planResults.recommendations.forEach((rec, index) => {
      checkPage(40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      const domainLabel = DOMAIN_LABELS[rec.domain] || rec.domain;
      doc.text(`${index + 1}. [${domainLabel}] ${rec.action}`, margin, y);
      y += 6;
  
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      const actionText = doc.splitTextToSize(rec.reason, pageWidth - 2 * margin);
      doc.text(actionText, margin, y);
      y += actionText.length * 5 + 6;
    });
  }
  
  // 6. Nutritional Plan
  checkPage(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(34, 197, 94);
  doc.text('PLAN NUTRICIONAL BASE', margin, y);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`Calorías diarias: ${planResults.twin_state.biometrics.tdee} kcal`, margin, y);
  y += 8;
  doc.text(`Proteínas: ${planResults.twin_state.biometrics.protein} g/día`, margin, y);
  y += 8;
  doc.text(`Hidratación: ${planResults.twin_state.biometrics.waterL} L/día`, margin, y);

  // Footer
  addFooter();

  // Save
  doc.save('mi-plan-bienestar.pdf');
}
