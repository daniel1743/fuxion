import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import ReactECharts from 'echarts-for-react';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 11, lineHeight: 1.6 },
  cover: {
    padding: 60,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10, color: '#fff' },
  subtitle: { fontSize: 16, color: '#a7f3d0', marginBottom: 40 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#064e3b' },
  subtitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 4, color: '#059669' },
  text: { fontSize: 11, marginBottom: 4, color: '#374151' },
  score: { fontSize: 28, fontWeight: 'bold', color: '#064e3b' },
  scoreLabel: { fontSize: 10, color: '#6b7280' },
  bullet: { fontSize: 11, marginBottom: 2, paddingLeft: 10 },
  chart: { width: '100%', height: 300, marginVertical: 20 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 9, color: '#9ca3af', textAlign: 'center' },
  disclaimer: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#9ca3af',
    marginTop: 20,
    textAlign: 'center',
  },
});

const RadarChart = ({ data }) => {
  const option = {
    radar: {
      indicator: data.map(d => ({ name: d.name, max: 100 })),
      shape: 'polygon',
      splitNumber: 5,
      axisName: { color: '#374151', fontSize: 10 },
      splitArea: { areaStyle: { color: ['#f0fdf4', '#ffffff'] } },
      splitLine: { lineStyle: { color: '#e5e7eb' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: data.map(d => d.value),
        name: 'Tu nivel',
        areaStyle: { color: 'rgba(16, 185, 129, 0.3)' },
        lineStyle: { color: '#10b981', width: 2 },
        itemStyle: { color: '#10b981' },
      }],
    }],
    tooltip: { trigger: 'item' },
  };

  return <ReactECharts option={option} style={{ width: '100%', height: 350 }} />;
};

const BarChart = ({ data }) => {
  const option = {
    grid: { left: 100, right: 40, top: 20, bottom: 40 },
    xAxis: { type: 'value', max: 100, axisLabel: { fontSize: 10 } },
    yAxis: { type: 'category', data: data.map(d => d.name), axisLabel: { fontSize: 10 } },
    series: [{
      type: 'bar',
      data: data.map(d => ({
        value: d.value,
        itemStyle: {
          color: d.value > 70 ? '#10b981' : d.value > 40 ? '#f59e0b' : '#ef4444',
        },
      })),
      barWidth: 15,
    }],
    tooltip: { trigger: 'axis' },
  };

  return <ReactECharts option={option} style={{ width: '100%', height: 400 }} />;
};

const LineChart = ({ data, title }) => {
  const option = {
    title: { text: title, left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: data.map(d => d.label) },
    yAxis: { type: 'value', min: 0, max: 100 },
    series: [{
      type: 'line',
      data: data.map(d => d.value),
      smooth: true,
      lineStyle: { color: '#10b981', width: 3 },
      areaStyle: { color: 'rgba(16, 185, 129, 0.1)' },
      itemStyle: { color: '#10b981' },
    }],
  };

  return <ReactECharts option={option} style={{ width: '100%', height: 300 }} />;
};

const GaugeChart = ({ value, label }) => {
  const option = {
    series: [{
      type: 'gauge',
      min: 0,
      max: 100,
      progress: { show: true, width: 18 },
      axisLine: { lineStyle: { width: 18 } },
      axisTick: { show: false },
      splitLine: { length: 15, lineStyle: { width: 2, color: '#999' } },
      axisLabel: { distance: 25, fontSize: 10 },
      anchor: { show: true, showAbove: true, size: 25, itemStyle: { borderWidth: 10 } },
      title: { show: true, fontSize: 14 },
      detail: { valueAnimation: true, fontSize: 30, offsetCenter: [0, '70%'] },
      data: [{ value, name: label }],
    }],
  };

  return <ReactECharts option={option} style={{ width: '100%', height: 280 }} />;
};

export default class WellnessReport extends React.Component {
  render() {
    const { data, aiText } = this.props;
    const { ib, age, areas, strengths, risks, priorities } = data;

    const areaEntries = Object.entries(areas).map(([name, value]) => ({ name, value }));

    return (
      <Document>
        {/* Portada */}
        <Page size="A4" style={styles.cover}>
          <Text style={styles.title}>Bienestar en Claro</Text>
          <Text style={styles.subtitle}>Informe Personalizado de Salud</Text>
          <View style={{ marginTop: 40 }}>
            <Text style={{ fontSize: 48, color: '#34d399' }}>{ib}/100</Text>
            <Text style={{ fontSize: 12, color: '#a7f3d0', marginTop: 8 }}>
              Índice de Bienestar
            </Text>
            <Text style={{ fontSize: 11, color: '#a7f3d0', marginTop: 20 }}>
              {age.biological} años · Evaluado el {new Date(data.timestamp).toLocaleDateString('es-CL')}
            </Text>
          </View>
        </Page>

        {/* Resumen Ejecutivo */}
        <Page style={styles.page}>
          <Text style={styles.sectionTitle}>Resumen Ejecutivo</Text>

          <View style={{ flexDirection: 'row', gap: 20, marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.scoreLabel}>Índice de Bienestar</Text>
              <Text style={styles.score}>{ib}/100</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.scoreLabel}>Edad Cronológica</Text>
              <Text style={styles.score}>{age.chronological}</Text>
              <Text style={styles.scoreLabel}>años</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.scoreLabel}>Edad Biológica</Text>
              <Text style={styles.score}>{age.biological}</Text>
              <Text style={styles.scoreLabel}>años</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>Fortalezas</Text>
          {strengths.map((s, i) => (
            <Text key={i} style={styles.bullet}>✓ {s}</Text>
          ))}

          <Text style={{ ...styles.subtitle, marginTop: 12 }}>Riesgos principales</Text>
          {risks.map((r, i) => (
            <Text key={i} style={styles.bullet}>⚠ {r}</Text>
          ))}

          <Text style={{ ...styles.subtitle, marginTop: 12 }}>Tres prioridades absolutas</Text>
          {priorities.map((p, i) => (
            <Text key={i} style={styles.bullet}>
              {i + 1}. {p.label} (score: {p.score}/100)
            </Text>
          ))}

          {aiText?.executiveSummary && (
            <Text style={{ marginTop: 12 }}>{aiText.executiveSummary}</Text>
          )}
        </Page>

        {/* Radar Chart */}
        <Page style={styles.page}>
          <Text style={styles.sectionTitle}>Perfil de Salud — Radar</Text>
          <Text style={styles.text}>Visualización general de tus 12 áreas de salud</Text>
          <RadarChart data={areaEntries} />
        </Page>

        {/* Bar Chart */}
        <Page style={styles.page}>
          <Text style={styles.sectionTitle}>Radiografía Completa</Text>
          <Text style={styles.text}>Puntuación por cada área de salud</Text>
          <BarChart data={areaEntries} />
        </Page>

        {/* Gauge Charts */}
        <Page style={styles.page}>
          <Text style={styles.sectionTitle}>Indicadores Clave</Text>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <View style={{ flex: 1 }}>
              <GaugeChart value={ib} label="Bienestar" />
            </View>
            <View style={{ flex: 1 }}>
              <GaugeChart value={areas.sleep} label="Sueño" />
            </View>
          </View>
        </Page>

        {/* Disclaimer */}
        <Page style={styles.page}>
          <Text style={styles.disclaimer}>
            Este informe tiene un propósito meramente informativo. No constituye diagnóstico ni tratamiento médico.
            Consulte siempre a un profesional de salud calificado.
          </Text>
        </Page>
      </Document>
    );
  }
}
