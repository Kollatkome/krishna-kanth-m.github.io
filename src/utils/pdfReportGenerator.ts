import { jsPDF } from 'jspdf';
import type { ProtoSemWeek, ProtoSemDateEntry } from '../types/protosem';

export interface PDFExportOptions {
  week: ProtoSemWeek;
  entries: ProtoSemDateEntry[];
  traineeName?: string;
  programmeName?: string;
  organization?: string;
}

export const generateWeekPDF = async ({
  week,
  entries,
  traineeName = 'KRISHNA KANTH M',
  programmeName = 'PRICE ProtoSem Innovation Fellowship',
  organization = 'Forge Innovation & Ventures / Kumaraguru'
}: PDFExportOptions): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawHeaderWatermark();
    }
  };

  const drawHeaderWatermark = () => {
    doc.setFontSize(8);
    doc.setTextColor(140, 150, 170);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `PRICE ProtoSem Sprint Dossier // Week ${week.weekNumber < 10 ? `0${week.weekNumber}` : week.weekNumber}${week.name ? ` - ${week.name}` : ''}`,
      margin,
      8
    );
    doc.text(`Trainee: ${traineeName}`, pageWidth - margin - 35, 8);
    doc.setDrawColor(220, 225, 235);
    doc.line(margin, 10, pageWidth - margin, 10);
    doc.setTextColor(30, 41, 59);
  };

  // --- COVER / HEADER BANNER ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'F');

  // Accent Line
  doc.setFillColor(99, 102, 241); // indigo-500
  doc.rect(margin, y, 4, 32, 'F');

  // Header Text
  doc.setTextColor(199, 210, 254); // indigo-200
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(programmeName.toUpperCase(), margin + 8, y + 8);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  const weekNumStr = week.weekNumber < 10 ? `0${week.weekNumber}` : `${week.weekNumber}`;
  const weekTitleText = `WEEK ${weekNumStr}${week.name ? `: ${week.name.toUpperCase()}` : ''}`;
  doc.text(weekTitleText, margin + 8, y + 16);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(
    `Fellow: ${traineeName}   |   Organization: ${organization}`,
    margin + 8,
    y + 24
  );

  y += 38;

  // --- ENTRIES TIMELINE ---
  if (!entries || entries.length === 0) {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text('No published journal entries recorded for this sprint week.', margin + 8, y + 14);
    y += 30;
  } else {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      checkPageBreak(35);

      // Date Header Banner
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text(`DATE: ${entry.date.toUpperCase()}${entry.title ? ` — ${entry.title}` : ''}`, margin + 4, y + 5.5);
      y += 12;

      // Notes Content
      if (entry.notes) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        const splitNotes = doc.splitTextToSize(entry.notes, contentWidth - 4);
        checkPageBreak(splitNotes.length * 4.5 + 4);
        doc.text(splitNotes, margin + 2, y);
        y += splitNotes.length * 4.5 + 4;
      }

      // Attachments list
      if (entry.attachments && entry.attachments.length > 0) {
        checkPageBreak(entry.attachments.length * 5 + 6);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(79, 70, 229);
        doc.text(`ATTACHMENTS (${entry.attachments.length}):`, margin + 2, y);
        y += 4.5;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        for (const att of entry.attachments) {
          doc.text(`• [${att.type}] ${att.name}${att.size ? ` (${att.size})` : ''}`, margin + 4, y);
          y += 4.5;
        }
        y += 3;
      }

      y += 4;
    }
  }

  // --- SIGNATURE FOOTER ---
  checkPageBreak(30);
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('INNOVATION FELLOW SIGNATURE', margin, y);
  doc.text('FORGE MENTOR VERIFICATION', pageWidth - margin - 50, y);

  y += 12;
  doc.setFont('helvetica', 'normal');
  doc.text(traineeName, margin, y);
  doc.text('Forge Innovation & Ventures', pageWidth - margin - 50, y);

  y += 4;
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, y);

  // Trigger download
  const cleanName = week.name ? week.name.replace(/[^a-zA-Z0-9]/g, '_') : 'Dossier';
  const fileName = `KrishnaKanth_ProtoSem_Week_${weekNumStr}_${cleanName}.pdf`;
  doc.save(fileName);
};
