import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

/**
 * Downloads a DOM element as a high-definition PNG image
 */
export async function downloadRoutineAsPng(elementId: string, filename: string): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found.`);
    return false;
  }

  try {
    // Wait for SolaimanLipi and web fonts to be fully ready
    if (document.fonts) {
      await document.fonts.ready;
    }

    const canvas = await html2canvas(element, {
      scale: 2, // 2x crisp resolution
      useCORS: true,
      allowTaint: false, // Critical: must be false so toDataURL / toBlob doesn't get tainted
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 1200, // Fixed width for consistent render
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.transform = 'none';
          clonedEl.style.boxShadow = 'none';
        }
      },
    });

    // Try toBlob first (modern, highly compatible)
    if (canvas.toBlob) {
      return new Promise<boolean>((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            // Fallback to toDataURL
            try {
              const dataUrl = canvas.toDataURL('image/png');
              triggerDownload(dataUrl, filename.endsWith('.png') ? filename : `${filename}.png`);
              resolve(true);
            } catch (err) {
              console.error('Canvas export error:', err);
              resolve(false);
            }
            return;
          }
          const url = URL.createObjectURL(blob);
          triggerDownload(url, filename.endsWith('.png') ? filename : `${filename}.png`);
          setTimeout(() => URL.revokeObjectURL(url), 2000);
          resolve(true);
        }, 'image/png');
      });
    } else {
      const dataUrl = canvas.toDataURL('image/png');
      triggerDownload(dataUrl, filename.endsWith('.png') ? filename : `${filename}.png`);
      return true;
    }
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
    console.error(`Element with id "${elementId}" not found.`);
    return false;
  }

  try {
    if (document.fonts) {
      await document.fonts.ready;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 1200,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: orientation === 'l' ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = orientation === 'l' ? 297 : 210;
    const pageHeight = orientation === 'l' ? 210 : 297;
    const margin = 8; // 8mm margin
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    if (contentHeight <= pageHeight - margin * 2) {
      // Single page fits cleanly
      pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);
    } else {
      // Multi-page handling
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
 * Helper to trigger file download in browser
 */
function triggerDownload(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Native browser print (always works 100% as fallback)
 */
export function printRoutine(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;
  window.print();
}
