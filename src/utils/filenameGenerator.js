import { sanitizeForFilename } from './pdfExtractor';

export function generateFilename(record, pattern, dateFormat, currencyFormat) {
  const currentPattern = pattern.trim() || '{data}_{favorecido}_{valor}';

  // 1. Formatar Data
  let dateStr = 'SEM_DATA';
  if (record.date) {
    const parts = record.date.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      if (dateFormat === 'DD-MM-YYYY') {
        dateStr = `${d}-${m}-${y}`;
      } else if (dateFormat === 'YYYYMMDD') {
        dateStr = `${y}${m}${d}`;
      } else {
        dateStr = `${y}-${m}-${d}`;
      }
    }
  }

  // 2. Formatar Valor
  let valueStr = 'SEM_VALOR';
  if (record.value !== null && record.value !== undefined && !isNaN(record.value)) {
    const numVal = Number(record.value);
    if (currencyFormat === 'br') {
      valueStr = `R$${numVal.toFixed(2).replace('.', ',')}`;
    } else if (currencyFormat === 'clean') {
      valueStr = `${numVal.toFixed(2).replace('.', '_')}`;
    } else {
      valueStr = numVal.toFixed(2);
    }
  }

  // 3. Favorecido
  const favStr = record.favorecido ? sanitizeForFilename(record.favorecido) : '';

  // 4. Tipo de Documento
  const tipoStr = record.docType || 'DOC';

  // 5. Nome Original
  const origStr = sanitizeForFilename(record.originalName.replace(/\.pdf$/i, ''));

  let newName = currentPattern
    .replace(/{data}/g, dateStr)
    .replace(/{valor}/g, valueStr)
    .replace(/{favorecido}/g, favStr)
    .replace(/{tipo}/g, tipoStr)
    .replace(/{origem}/g, origStr);

  // Limpeza de underlines duplos ou pontuações estranhas
  newName = newName
    .replace(/__+/g, '_')
    .replace(/^_|_$/g, '')
    .trim();

  return (newName || 'arquivo_renomeado') + '.pdf';
}
