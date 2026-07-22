import React, { useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';
import BRANDING from '@/branding/branding';

const DOMAIN_LABELS = {
  nutrition: 'Nutricion',
  activity: 'Actividad',
  sleep: 'Sueno',
  mental: 'Estres',
  biometry: 'Biometria',
  digestion: 'Digestion',
  habits: 'Habitos',
};

function MetricCard({ label, value, helper }) {
  return (
    <div style={{
      border: '1px solid #d1fae5',
      borderRadius: 16,
      padding: '18px 16px',
      background: '#ffffff',
      minHeight: 104,
    }}>
      <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
        {label}
      </p>
      <strong style={{ display: 'block', color: '#064e3b', fontSize: '1.45rem', lineHeight: 1.1 }}>
        {value}
      </strong>
      {helper && (
        <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '0.78rem', lineHeight: 1.35 }}>
          {helper}
        </p>
      )}
    </div>
  );
}

function DomainRow({ label, score }) {
  const color = score >= 75 ? '#16a34a' : score >= 55 ? '#d97706' : '#dc2626';
  return (
    <div style={{ marginBottom: 13 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 5 }}>
        <span style={{ color: '#334155', fontWeight: 700, fontSize: '0.9rem' }}>{label}</span>
        <span style={{ color, fontWeight: 900, fontSize: '0.9rem' }}>{Math.round(score)}/100</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: '#e5e7eb', overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(100, Math.max(0, score))}%`, height: '100%', background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}

function RecommendationBlock({ rec, index }) {
  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderLeft: '5px solid #0f766e',
      borderRadius: 16,
      padding: '16px 18px',
      background: '#ffffff',
      marginBottom: 14,
      breakInside: 'avoid',
    }}>
      <p style={{ margin: '0 0 6px', color: '#0f766e', fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase' }}>
        Prioridad {index + 1} · {rec.severity || 'preventiva'} · {rec.priority || rec.finalScore || '--'}/100
      </p>
      <h3 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '1.05rem', lineHeight: 1.25 }}>
        {rec.action}
      </h3>
      <p style={{ margin: 0, color: '#475569', fontSize: '0.88rem', lineHeight: 1.55 }}>
        {rec.why || rec.reason}
      </p>
      {rec.personalization_note && (
        <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '0.8rem', lineHeight: 1.45 }}>
          {rec.personalization_note}
        </p>
      )}
    </div>
  );
}

function ReportHeader({ label = 'Informe Premium' }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #e2e8f0',
      paddingBottom: 12,
      marginBottom: 24,
    }}>
      <img src={BRANDING.logos.horizontal} alt="Bienestar en Claro" style={{ width: 150, height: 'auto' }} />
      <span style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </span>
    </div>
  );
}

export default function PremiumReportTemplate({ markdownContent, userData, twinData, onComplete }) {
  const containerRef = useRef(null);
  const biometrics = twinData?.twin_state?.biometrics || {};
  const iib = twinData?.twin_state?.iib || {};
  const domains = iib.domains || {};
  const analysis = twinData?.twin_state?.adaptive_analysis || {};
  const confidence = analysis.data_completeness || {};
  const insights = analysis.domain_insights || {};
  const recommendations = twinData?.recommendations || [];
  const reportId = useMemo(() => {
    const hash = Buffer.from(`${userData.name}-${Date.now()}-${Math.random()}`).toString('base64').slice(0, 12);
    return `BEC-${new Date().getFullYear()}-${hash.toUpperCase()}`;
  }, [userData.name]);

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
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src={BRANDING.logos.watermark}
          alt=""
          style={{
            position: 'absolute',
            width: 560,
            opacity: 0.08,
            right: -120,
            top: 90,
            pointerEvents: 'none',
          }}
        />
        <div style={{ marginBottom: 40 }}>
          <img 
            src={BRANDING.logos.print || BRANDING.logos.horizontal}
            alt="Bienestar en Claro" 
            style={{ width: 300, height: 'auto', marginBottom: 20 }}
          />
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '7px 16px',
          borderRadius: 999,
          background: '#ffffff',
          border: '1px solid #bbf7d0',
          color: '#166534',
          fontSize: '0.78rem',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 24,
        }}>
          Informe premium personalizado
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#166534', marginBottom: 60 }}>
          Tu Plan a Medida
        </h1>

        <div style={{ padding: '20px 40px', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 20 }}>
          <p style={{ fontSize: '1.2rem', margin: '0 0 8px', fontWeight: 600 }}>Preparado exclusivamente para:</p>
          <p style={{ fontSize: '1.5rem', margin: 0, color: '#15803d', fontWeight: 700 }}>{userData.name}</p>
        </div>

        <p style={{ maxWidth: 520, color: '#166534', fontSize: '1rem', lineHeight: 1.6, marginTop: 28 }}>
          Informe personalizado de bienestar, prioridades de acción y roadmap de seguimiento.
        </p>

        <div style={{ marginTop: 'auto', color: '#166534', fontSize: '0.9rem' }}>
          <p>Generado el {new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p>Informe {reportId} · v2.0</p>
          <p>© 2026 Bienestar en Claro. Todos los derechos reservados.</p>
        </div>
      </div>

      {/* Resumen Ejecutivo Visual */}
      <section
        className="pdf-page-break"
        style={{
          pageBreakAfter: 'always',
          minHeight: 980,
          paddingTop: 10,
        }}
      >
        <ReportHeader label="Resumen ejecutivo" />
        <p style={{ margin: '0 0 8px', color: '#0f766e', fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase' }}>
          Resumen ejecutivo
        </p>
        <h1 style={{ margin: '0 0 12px', color: '#052e2b', fontSize: '2.2rem', lineHeight: 1.1 }}>
          La lectura central de tu estudio
        </h1>
        <p style={{ margin: '0 0 24px', color: '#475569', fontSize: '1rem', lineHeight: 1.65 }}>
          Este resumen traduce tus respuestas en prioridades de accion. No busca etiquetarte: busca mostrar que palancas tienen mas impacto para avanzar con orden.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 14,
          marginBottom: 24,
        }}>
          <MetricCard label="IIB" value={`${iib.score || 0}/100`} helper={iib.level ? `Nivel ${iib.level}` : 'Indice integral de bienestar'} />
          <MetricCard label="Confianza" value={`${confidence.score || 0}%`} helper={confidence.confidence ? `Lectura ${confidence.confidence}` : 'Segun datos completados'} />
          <MetricCard label="IMC" value={biometrics.bmi || '--'} helper={biometrics.bmiClass?.label || biometrics.bmiClass || 'Estimacion biometrica'} />
          <MetricCard label="Foco primario" value={analysis.primary_focus?.label || 'Bienestar integral'} helper="Area con mayor oportunidad relativa" />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 18,
          marginBottom: 24,
        }}>
          <div style={{ background: '#f8fafc', borderRadius: 18, padding: 20, border: '1px solid #e2e8f0' }}>
            <h2 style={{ margin: '0 0 12px', color: '#0f172a', fontSize: '1.15rem' }}>Mapa por dominio</h2>
            {Object.entries(domains).map(([key, score]) => (
              <DomainRow key={key} label={DOMAIN_LABELS[key] || key} score={score} />
            ))}
          </div>

          <div style={{ background: '#ecfdf5', borderRadius: 18, padding: 20, border: '1px solid #bbf7d0' }}>
            <h2 style={{ margin: '0 0 12px', color: '#064e3b', fontSize: '1.15rem' }}>Interpretacion rapida</h2>
            <p style={{ margin: '0 0 12px', color: '#166534', fontSize: '0.92rem', lineHeight: 1.55 }}>
              <strong>Mayor oportunidad:</strong> {(insights.weakest || []).map((item) => `${item.label} ${item.score}/100`).join(', ') || 'sin datos suficientes'}.
            </p>
            <p style={{ margin: '0 0 12px', color: '#166534', fontSize: '0.92rem', lineHeight: 1.55 }}>
              <strong>Base fuerte:</strong> {(insights.strongest || []).map((item) => `${item.label} ${item.score}/100`).join(', ') || 'sin datos suficientes'}.
            </p>
            <p style={{ margin: 0, color: '#166534', fontSize: '0.92rem', lineHeight: 1.55 }}>
              <strong>Perfil:</strong> {insights.pattern === 'perfil_desbalanceado' ? 'desbalanceado, con oportunidades claras de priorizacion' : insights.pattern === 'perfil_solido' ? 'solido, listo para optimizar detalles' : 'en construccion, ideal para crear base sostenible'}.
            </p>
          </div>
        </div>

        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 18, padding: 20 }}>
          <h2 style={{ margin: '0 0 10px', color: '#9a3412', fontSize: '1.15rem' }}>Palancas de mayor impacto</h2>
          {(analysis.adaptive_levers || []).map((lever) => (
            <p key={lever.domain} style={{ margin: '0 0 7px', color: '#9a3412', fontSize: '0.9rem', lineHeight: 1.45 }}>
              <strong>{lever.label}:</strong> {lever.current} hacia {lever.target}.
            </p>
          ))}
        </div>
      </section>

      {/* Prioridades de Accion */}
      <section
        className="pdf-page-break"
        style={{
          pageBreakAfter: 'always',
          minHeight: 980,
          paddingTop: 10,
        }}
      >
        <ReportHeader label="Plan accionable" />
        <p style={{ margin: '0 0 8px', color: '#0f766e', fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase' }}>
          Plan accionable
        </p>
        <h1 style={{ margin: '0 0 12px', color: '#052e2b', fontSize: '2.1rem', lineHeight: 1.1 }}>
          Tus prioridades iniciales
        </h1>
        <p style={{ margin: '0 0 22px', color: '#475569', fontSize: '1rem', lineHeight: 1.65 }}>
          Estas acciones fueron ordenadas por prioridad dinamica. La meta es empezar por lo que ofrece mejor retorno y menor friccion.
        </p>

        {recommendations.map((rec, index) => (
          <RecommendationBlock key={rec.rule_id || rec.id || index} rec={rec} index={index} />
        ))}

        <div style={{ marginTop: 26, background: '#f8fafc', borderRadius: 18, padding: 20, border: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: '0 0 12px', color: '#0f172a', fontSize: '1.15rem' }}>Roadmap de 30 dias</h2>
          {[
            ['Dias 1-7', 'Estabilizar', recommendations[0]?.action || 'Iniciar el habito principal'],
            ['Dias 8-21', 'Consolidar', recommendations[1]?.action || 'Convertir el avance en rutina'],
            ['Dias 22-30', 'Medir', recommendations[2]?.action || 'Revisar energia, digestion, sueno y adherencia'],
          ].map(([range, title, detail]) => (
            <div key={range} style={{ display: 'grid', gridTemplateColumns: '95px 1fr', gap: 12, marginBottom: 12 }}>
              <strong style={{ color: '#0f766e', fontSize: '0.9rem' }}>{range}</strong>
              <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', lineHeight: 1.45 }}>
                <strong>{title}:</strong> {detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contenido Markdown */}
      <div
        className="premium-markdown-content"
        style={{
          fontSize: '1.1rem',
          lineHeight: '1.8',
          position: 'relative',
        }}
      >
        <ReportHeader label="Analisis personalizado" />
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
        <img src={BRANDING.logos.horizontal} alt="Bienestar en Claro" style={{ width: 190, height: 'auto', marginBottom: 18 }} />
        <p style={{ marginBottom: 8, lineHeight: 1.6 }}>
          <strong>Nota importante:</strong> Este documento ha sido generado por el sistema de Inteligencia Artificial de Bienestar en Claro con fines exclusivamente informativos y educativos. No constituye un diagnóstico médico ni sustituye la consulta con un profesional de la salud cualificado.
        </p>
        <p style={{ marginBottom: 4 }}>
          WhatsApp: +56 989 63 90 88 | Instagram: @donde_mi_negro
        </p>
        <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 8 }}>
          Informe {reportId} · Generado el {new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })} · v2.0
        </p>
      </div>
    </div>
  );
}

// Función auxiliar para exportar a PDF utilizando html2pdf
export async function downloadPremiumPDF(element, filename = 'Mi_Plan_Bienestar.pdf') {
  // Restaurar visibilidad temporalmente para que html2pdf pueda renderizar
  const originalClipPath = element.style.clipPath;
  const originalVisibility = element.style.visibility;
  const originalZIndex = element.style.zIndex;
  const originalPointerEvents = element.style.pointerEvents;

  element.style.clipPath = 'none';
  element.style.zIndex = '99999';
  element.style.pointerEvents = 'none';

  // Esperar a que se renderice y las imágenes carguen
  await new Promise(resolve => setTimeout(resolve, 1000));

  const opt = {
    margin: [10, 10, 10, 10],
    filename: filename,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      letterRendering: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 800,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: { mode: ['css', 'legacy', 'avoid-before'], before: '.pdf-page-break' },
  };

  try {
    await html2pdf().from(element).set(opt).save();
  } finally {
    // Restaurar estado original
    element.style.clipPath = originalClipPath;
    element.style.zIndex = originalZIndex;
    element.style.pointerEvents = originalPointerEvents;
  }
}
