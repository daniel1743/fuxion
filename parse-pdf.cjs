const fs = require('fs');
const pdf = require('pdf-parse');

async function extractPDF() {
    let dataBuffer = fs.readFileSync('./public/branding/base de datos bienestar ia/Biblioteca Bienestar en Claro.pdf');
    const data = await pdf(dataBuffer);
    const text = data.text;
    
    // As parsing OCR text perfectly via Regex is notoriously unreliable without an AI model,
    // this script creates a structural scaffold and attempts to parse numbered lists.
    // For a 100% perfect extraction, a manual or LLM-assisted transcription of the 130 items is recommended.
    
    console.log("PDF cargado con éxito. Número de páginas:", data.numpages);
    
    // Basic RegEx to capture numbered interventions (e.g. "1. Terapia farmacológica")
    const interventionRegex = /(\d{1,2})\.\s([A-Z].+?)(?=\n\d{1,2}\.\s|\n[A-Z][a-z]+ \/ Estrategia|\n\n|$)/gs;
    
    let match;
    let interventions = [];
    
    while ((match = interventionRegex.exec(text)) !== null) {
        interventions.push({
            id: parseInt(match[1], 10),
            raw_text: match[2].trim()
        });
    }

    const output = {
        document_title: "Investigación Científica Maestra: Biblioteca Premium de Bienestar en Claro",
        note: "This is a raw automated extraction. The text boundaries in PDF tables may merge columns unpredictably.",
        extracted_interventions: interventions
    };

    fs.writeFileSync('./public/branding/base de datos bienestar ia/biblioteca_bienestar_completa.json', JSON.stringify(output, null, 2));
    console.log(`Extracción finalizada. Se encontraron ${interventions.length} posibles intervenciones.`);
}

extractPDF().catch(err => console.error("Error al procesar el PDF:", err));
