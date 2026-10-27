import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

/**
 * Ensures all SolaimanLipi and Bengali fonts are fully loaded into the browser font cache
 */
async function ensureFontsLoaded(): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;
  try {
    await document.fonts.ready;
    // Pre-warm SolaimanLipi weights
    await Promise.allSettled([
      document.fonts.load('400 12px SolaimanLipi'),
      document.fonts.load('700 12px SolaimanLipi'),
      document.fonts.load('400 14px SolaimanLipi'),
      document.fonts.load('700 14px SolaimanLipi'),
      document.fonts.load('400 16px SolaimanLipi'),
      document.fonts.load('700 16px SolaimanLipi'),
      document.fonts.load('700 24px SolaimanLipi'),
    ]);
  } catch (err) {
    console.warn('Font warming warning:', err);
  }
}

/**
 * Downloads a DOM element as a high-definition PNG image matching the exact preview
 */
export async function downloadRoutineAsPng(elementId: string, filename: string): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found.`);
    return false;
  }

  try {
    await ensureFontsLoaded();

    // Prepare capture options
    const canvas = await html2canvas(element, {
      scale: 2, // 2x ultra-crisp resolution
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1000,
      onclone: (clonedDoc) => {
        // Inject font definition into cloned document to guarantee font availability
        const style = clonedDoc.createElement('style');
        style.textContent = `
          @font-face {
            font-family: 'SolaimanLipi';
            font-style: normal;
            font-weight: 400;
            src: url('/fonts/solaimanlipi-normal.woff2') format('woff2'),
                 url('https://fonts.maateen.me/solaiman-lipi/solaimanlipi-normal-v1.0.woff2') format('woff2');
          }
          @font-face {
            font-family: 'SolaimanLipi';
            font-style: normal;
            font-weight: 700;
            src: url('/fonts/solaimanlipi-bold.woff2') format('woff2'),
                 url('https://fonts.maateen.me/solaiman-lipi/solaimanlipi-bold-v1.0.woff2') format('woff2');
          }
          #${elementId}, #${elementId} * {
            font-family: 'SolaimanLipi', 'Noto Sans Bengali', sans-serif !important;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
          }
        `;
        clonedDoc.head.appendChild(style);

        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.width = '840px';
          clonedEl.style.minWidth = '840px';
          clonedEl.style.maxWidth = '840px';
          clonedEl.style.margin = '0 auto';
          clonedEl.style.boxShadow = 'none';
          clonedEl.style.transform = 'none';

          // Reset all parent containers in cloned DOM so mobile view doesn't constrain or clip the canvas
          let current: HTMLElement | null = clonedEl.parentElement;
          while (current && current !== clonedDoc.body) {
            current.style.width = 'auto';
            current.style.minWidth = '860px';
            current.style.overflow = 'visible';
            current.style.padding = '0';
            current.style.margin = '0';
            current = current.parentElement;
          }
          clonedDoc.body.style.width = '860px';
          clonedDoc.body.style.minWidth = '860px';
          clonedDoc.body.style.overflow = 'visible';
        }
      },
    });

    if (canvas.toBlob) {
      return new Promise<boolean>((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) {
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
    await ensureFontsLoaded();

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1000,
      onclone: (clonedDoc) => {
        const style = clonedDoc.createElement('style');
        style.textContent = `
          @font-face {
            font-family: 'SolaimanLipi';
            font-style: normal;
            font-weight: 400;
            src: url('/fonts/solaimanlipi-normal.woff2') format('woff2'),
                 url('https://fonts.maateen.me/solaiman-lipi/solaimanlipi-normal-v1.0.woff2') format('woff2');
          }
          @font-face {
            font-family: 'SolaimanLipi';
            font-style: normal;
            font-weight: 700;
            src: url('/fonts/solaimanlipi-bold.woff2') format('woff2'),
                 url('https://fonts.maateen.me/solaiman-lipi/solaimanlipi-bold-v1.0.woff2') format('woff2');
          }
          #${elementId}, #${elementId} * {
            font-family: 'SolaimanLipi', 'Noto Sans Bengali', sans-serif !important;
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
          }
        `;
        clonedDoc.head.appendChild(style);

        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.width = '840px';
          clonedEl.style.minWidth = '840px';
          clonedEl.style.maxWidth = '840px';
          clonedEl.style.margin = '0 auto';
          clonedEl.style.boxShadow = 'none';
          clonedEl.style.transform = 'none';

          let current: HTMLElement | null = clonedEl.parentElement;
          while (current && current !== clonedDoc.body) {
            current.style.width = 'auto';
            current.style.minWidth = '860px';
            current.style.overflow = 'visible';
            current.style.padding = '0';
            current.style.margin = '0';
            current = current.parentElement;
          }
          clonedDoc.body.style.width = '860px';
          clonedDoc.body.style.minWidth = '860px';
          clonedDoc.body.style.overflow = 'visible';
        }
      },
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
    const margin = 8;
    const usableWidth = pageWidth - margin * 2;
    const usableHeight = pageHeight - margin * 2;

    const naturalContentHeight = (canvas.height * usableWidth) / canvas.width;

    // Check if it fits on a single page or fits with minor scale adjustment (< 12%)
    if (naturalContentHeight <= usableHeight) {
      pdf.addImage(imgData, 'JPEG', margin, margin, usableWidth, naturalContentHeight, undefined, 'FAST');
    } else if (naturalContentHeight <= usableHeight * 1.15) {
      // Scale slightly down to fit on a single crisp A4 page
      const scale = usableHeight / naturalContentHeight;
      const fitWidth = usableWidth * scale;
      const xOffset = margin + (usableWidth - fitWidth) / 2;
      pdf.addImage(imgData, 'JPEG', xOffset, margin, fitWidth, usableHeight, undefined, 'FAST');
    } else {
      // Multi-page handling
      let heightLeft = naturalContentHeight;
      let position = margin;

      pdf.addImage(imgData, 'JPEG', margin, position, usableWidth, naturalContentHeight, undefined, 'FAST');
      heightLeft -= usableHeight;

      while (heightLeft > 0) {
        position = heightLeft - naturalContentHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, usableWidth, naturalContentHeight, undefined, 'FAST');
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
