import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Downloads a DOM element as a high-definition PNG image
 */
export async function downloadRoutineAsPng(elementId: string, filename: string): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  try {
    // Wait for all fonts (especially SolaimanLipi) to finish loading
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Capture with high pixel ratio for print-ready clarity
    const canvas = await html2canvas(element, {
      scale: 2.5, // Crisp 2.5x retina scaling
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          // Ensure element has standard sizing in clone
          clonedEl.style.boxShadow = 'none';
          clonedEl.style.borderRadius = '0px';
        }
      },
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Error generating PNG image:', error);
    return false;
  }
}

/**
 * Downloads a DOM element as a formatted A4 PDF
 */
export async function downloadRoutineAsPdf(
  elementId: string,
  filename: string,
  orientation: 'p' | 'l' = 'p'
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return false;
  }

  try {
    if (document.fonts) {
      await document.fonts.ready;
    }

    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: orientation === 'l' ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = orientation === 'l' ? 297 : 210;
    const pageHeight = orientation === 'l' ? 210 : 297;
    const margin = 10; // 10mm margin
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    if (contentHeight <= pageHeight - margin * 2) {
      // Single page fits
      pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);
    } else {
      // Multi-page slicing
      let heightLeft = contentHeight;
      let position = margin;
      const usableHeight = pageHeight - margin * 2;

      pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
      heightLeft -= usableHeight;

      while (heightLeft > 0) {
        position = heightLeft - contentHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
        heightLeft -= usableHeight;
      }
    }

    const finalPdfName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(finalPdfName);
    return true;
  } catch (error) {
    console.error('Error generating PDF document:', error);
    return false;
  }
}

/**
 * Trigger clean browser printing
 */
export function printRoutine(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;
  window.print();
}
