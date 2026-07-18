import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';
import BRANDING from '@/branding/branding';

export default function PremiumReportTemplate({ markdownContent, userData, onComplete }) {
  const containerRef = useRef(null);

  // Exponemos un método para disparar el PDF desde fuera, pero lo haremos con un hook simple
  // de forma que al montarse o al clickear se descargue. Para este caso, el componente padre
  // llamará a generatePDF() a través de un ref, o nosotros proveeremos una función exportada.

  return (
    <div
      ref={containerRef}
      style={{
        padding: '40px 60px',
        backgroundColor: '#ffffff',
        color: '#1f2937',
        fontFamily: "'Inter', sans-serif",
        maxWidth: 800,
        margin: '0 auto',
      }}
    >
      {/* Portada Premium */}
      <div
        className="pdf-page-break"
        style={{
          height: '1050px', // A4 aprox (dependiendo de la escala)
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          pageBreakAfter: 'always',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          margin: '-40px -60px 40px -60px', // Compensar el padding del container
          padding: '60px',
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <img 
            src={BRANDING.logos.horizontal} 
            alt="Bienestar en Claro" 
            style={{ width: 280, height: 'auto', marginBottom: 20 }}
          />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#166534', marginBottom: 60 }}>
          Tu Plan a Medida
        </h1>
        
        <div style={{ padding: '20px 40px', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 20 }}>
          <p style={{ fontSize: '1.2rem', margin: '0 0 8px', fontWeight: 600 }}>Preparado exclusivamente para:</p>
          <p style={{ fontSize: '1.5rem', margin: 0, color: '#15803d', fontWeight: 700 }}>{userData.name}</p>
        </div>
        
        <div style={{ marginTop: 'auto', color: '#166534', fontSize: '0.9rem' }}>
          <p>Generado el {new Date().toLocaleDateString('es-CL')}</p>
          <p>© 2026 Bienestar en Claro. Todos los derechos reservados.</p>
        </div>
      </div>

      {/* Contenido Markdown */}
      <div
        className="premium-markdown-content"
        style={{
          fontSize: '1.1rem',
          lineHeight: '1.8',
        }}
      >
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 style={{ fontSize: '2rem', color: '#166534', marginTop: '2em', marginBottom: '1em', borderBottom: '2px solid #bbf7d0', paddingBottom: '0.5em', pageBreakBefore: 'always' }} {...props} />,
            h2: ({node, ...props}) => <h2 style={{ fontSize: '1.5rem', color: '#15803d', marginTop: '1.5em', marginBottom: '0.8em' }} {...props} />,
            h3: ({node, ...props}) => <h3 style={{ fontSize: '1.2rem', color: '#16a34a', marginTop: '1.2em', marginBottom: '0.5em' }} {...props} />,
            p: ({node, ...props}) => <p style={{ marginBottom: '1em' }} {...props} />,
            ul: ({node, ...props}) => <ul style={{ paddingLeft: '1.5em', marginBottom: '1em' }} {...props} />,
            li: ({node, ...props}) => <li style={{ marginBottom: '0.5em' }} {...props} />,
            strong: ({node, ...props}) => <strong style={{ color: '#111827', fontWeight: 700 }} {...props} />,
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
      
      {/* Footer General (Disclaimer) */}
      <div
        style={{
          marginTop: 60,
          paddingTop: 20,
          borderTop: '1px solid #e5e7eb',
          fontSize: '0.8rem',
          color: '#6b7280',
          textAlign: 'center',
          pageBreakBefore: 'always'
        }}
      >
        <p><strong>Nota importante:</strong> Este documento ha sido generado por el sistema de Inteligencia Artificial de Bienestar en Claro con fines exclusivamente informativos y educativos. No constituye un diagnóstico médico ni sustituye la consulta con un profesional de la salud cualificado.</p>
        <p>WhatsApp: +56 989 63 90 88 | Instagram: @donde_mi_negro</p>
      </div>
    </div>
  );
}

// Función auxiliar para exportar a PDF utilizando html2pdf
export async function downloadPremiumPDF(element, filename = 'Mi_Plan_Bienestar.pdf') {
  const opt = {
    margin:       [0, 0, 0, 0], // El margen lo maneja el CSS del componente
    filename:     filename,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'px', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['css', 'legacy'] }
  };

  return html2pdf().from(element).set(opt).save();
}
