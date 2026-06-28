const fs = require('fs');
const PDFParser = require('pdf2json');

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync('_temp_pdf_text.txt', pdfParser.getRawTextContent());
    console.log('PDF text extracted to _temp_pdf_text.txt');
});

pdfParser.loadPDF("Planilla Quiniela 2026 Fase Eliminatoria-2.pdf");
