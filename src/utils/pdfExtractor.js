// Extrator inteligente de metadados em PDFs (Client-side)

export function sanitizeForFilename(str) {
  if (!str) return '';
  return str
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-zA-Z0-9_\-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 35);
}

export function parseDateString(str) {
  if (!str) return null;
  const parts = str.split(/[\/\-]/);
  if (parts.length === 3) {
    let d, m, y;
    if (parts[0].length === 4) {
      // YYYY-MM-DD
      y = parseInt(parts[0], 10);
      m = parseInt(parts[1], 10) - 1;
      d = parseInt(parts[2], 10);
    } else {
      // DD-MM-YYYY
      d = parseInt(parts[0], 10);
      m = parseInt(parts[1], 10) - 1;
      y = parseInt(parts[2], 10);
    }
    if (y > 1990 && y < 2100 && m >= 0 && m < 12 && d >= 1 && d <= 31) {
      return new Date(y, m, d);
    }
  }
  return null;
}

export function formatDateIso(date) {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseMoneyString(str) {
  if (!str) return null;
  let s = str.trim().replace(/^R\$\s*/i, '');
  if (s.includes(',') && s.includes('.')) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (s.includes(',') && !s.includes('.')) {
    s = s.replace(',', '.');
  }
  const num = parseFloat(s);
  return isNaN(num) ? null : num;
}

// Detecta o tipo de documento financeiro
export function detectDocumentType(text) {
  const upper = text.toUpperCase();
  if (upper.includes('PIX') || upper.includes('CHAVE PIX') || upper.includes('TRANSACAO PIX')) {
    return 'PIX';
  }
  if (upper.includes('DANFE') || upper.includes('NOTA FISCAL') || upper.includes('NF-E') || upper.includes('NFS-E')) {
    return 'NFE';
  }
  if (upper.includes('BOLETO') || upper.includes('LINHA DIGITAVEL') || upper.includes('CEDENTE') || upper.includes('SACADO') || upper.includes('PAGAMENTO DE TITULO')) {
    return 'BOLETO';
  }
  if (upper.includes('TED') || upper.includes('DOC') || upper.includes('TRANSFERENCIA BANCARIA')) {
    return 'TRANSFERENCIA';
  }
  if (upper.includes('FATURA') || upper.includes('CARTAO DE CREDITO') || upper.includes('TOTAL DA FATURA')) {
    return 'FATURA';
  }
  return 'COMPROVANTE';
}

export async function extractPdfData(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  const maxPages = Math.min(pdfDoc.numPages, 3); // Lê até 3 primeiras páginas
  for (let p = 1; p <= maxPages; p++) {
    const page = await pdfDoc.getPage(p);
    const content = await page.getTextContent();
    fullText += content.items.map(item => item.str).join(' ') + '\n';
  }

  const cleanText = fullText.replace(/\s+/g, ' ').trim();
  const isScanned = cleanText.length < 15; // Pouco ou nenhum texto detectado

  const docType = detectDocumentType(cleanText);

  let date = null;
  let value = null;
  let favorecido = null;
  let notes = [];

  if (isScanned) {
    notes.push('PDF digitalizado ou em imagem (sem camada de texto nativa).');
  } else {
    // 1. DATA (Prioriza termos contextuais)
    const dateContextPatterns = [
      /(?:data\s*(?:de\s*pagamento|do\s*pagamento|da\s*transa[çc][ãa]o|de\s*liquida[çc][ãa]o|de\s*emiss[ãa]o|do\s*documento|vencimento)?)\s*[:=\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i,
      /(\d{2}\/\d{2}\/\d{4})\s*(?:às|as|\-)\s*\d{2}:\d{2}/i,
      /emiss[ãa]o\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i,
      /vencimento\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i
    ];

    for (const regex of dateContextPatterns) {
      const match = cleanText.match(regex);
      if (match && match[1]) {
        date = parseDateString(match[1]);
        if (date) break;
      }
    }

    // Fallback de Data
    if (!date) {
      const fallbackDate = cleanText.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/);
      if (fallbackDate && fallbackDate[1]) {
        date = parseDateString(fallbackDate[1]);
      }
    }

    // 2. VALOR (Contextual e imune a CNPJ / CPF / Linha Digitável)
    const valueContextPatterns = [
      /(?:valor\s*(?:final|pago|da\s*transa[çc][ãa]o|do\s*pagamento|cobrado|l[íi]quido|total|do\s*documento|principal))\s*[:=\-]?\s*(?:R\$\s*)?([\d.,]+)/i,
      /(?:total\s*da\s*nota|valor\s*total\s*da\s*nota|v\.?\s*total)\s*[:=\-]?\s*(?:R\$\s*)?([\d.,]+)/i,
      /(?:R\$\s*)([\d]{1,3}(?:\.[\d]{3})*,\d{2})/i
    ];

    for (const regex of valueContextPatterns) {
      const match = cleanText.match(regex);
      if (match && match[1]) {
        const parsed = parseMoneyString(match[1]);
        if (parsed !== null && parsed > 0 && parsed < 50000000) {
          value = parsed;
          break;
        }
      }
    }

    // Fallback Valor se não achou com contexto
    if (value === null) {
      const moneyRegex = /(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*,\d{2})/g;
      let match;
      const candidates = [];
      while ((match = moneyRegex.exec(cleanText)) !== null) {
        const val = parseMoneyString(match[1]);
        if (val !== null && val > 0 && val < 50000000) {
          candidates.push(val);
        }
      }
      if (candidates.length > 0) {
        value = Math.max(...candidates);
      }
    }

    // 3. FAVORECIDO / BENEFICIÁRIO / EMISSOR
    const favPatterns = [
      /(?:para|favorecido|benefici[áa]rio|nome\s*do\s*destinat[áa]rio|destinat[áa]rio|recebedor|raz[ãa]o\s*social|razao\s*social|nome\s*fantasia)\s*[:=\-]\s*([A-ZÀ-Ú0-9\s.,&\-]{3,40})/i,
      /(?:pago\s*a|enviado\s*para)\s*[:=\-]?\s*([A-ZÀ-Ú0-9\s.,&\-]{3,40})/i
    ];

    for (const regex of favPatterns) {
      const match = cleanText.match(regex);
      if (match && match[1]) {
        let favCandidate = match[1].trim();
        favCandidate = favCandidate.replace(/\s+(CPF|CNPJ|INSTITUIÇÃO|BANCO|CHAVE|VALOR).*/i, '').trim();
        if (favCandidate.length >= 3) {
          favorecido = sanitizeForFilename(favCandidate);
          break;
        }
      }
    }
  }

  let status = 'sucesso';
  if (isScanned) {
    status = 'atencao';
  } else if (!date && value === null) {
    status = 'atencao';
    notes.push('Não foi possível identificar data e valor com certeza.');
  } else if (!date) {
    status = 'atencao';
    notes.push('Data não identificada automaticamente.');
  } else if (value === null) {
    status = 'atencao';
    notes.push('Valor não identificado automaticamente.');
  }

  return {
    pdfDoc,
    docType,
    date: date ? formatDateIso(date) : '',
    value: value,
    favorecido: favorecido || '',
    status,
    notes: notes.join(' '),
    isScanned
  };
}
