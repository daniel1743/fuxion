import { pdf } from '@react-pdf/renderer';
import WellnessReport from '@/components/WellnessReportPDF';

/**
 * Hook para descargar el PDF de bienestar.
 * Uso:
 *   const { download, downloading, error } = usePDFDownload();
 *   await download(scores, aiText);
 */
export function usePDFDownload() {
  const downloading = false;
  const error = null;

  const download = async (scores, aiText) => {
    try {
      const doc = <WellnessReport data={scores} aiText={aiText} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plan-bienestar-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al generar PDF:', err);
      throw err;
    }
  };

  return { download, downloading, error };
}

export default usePDFDownload;
