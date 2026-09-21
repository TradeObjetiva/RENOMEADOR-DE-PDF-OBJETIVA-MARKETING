// Exporta lista de comprovantes processados para CSV compatível com Excel (UTF-8 com BOM)

export function exportToCsv(records, getNewFilename) {
  if (!records || records.length === 0) return;

  const headers = [
    'Nome Original',
    'Novo Nome',
    'Tipo Documento',
    'Data Transação',
    'Favorecido / Destinatário',
    'Valor (R$)',
    'Status Reconhecimento',
    'Observações'
  ];

  const rows = records.map(rec => {
    const newName = getNewFilename(rec);
    const formattedValue = rec.value !== null && !isNaN(rec.value) ? Number(rec.value).toFixed(2).replace('.', ',') : '0,00';
    
    return [
      rec.originalName,
      newName,
      rec.docType || 'OUTRO',
      rec.date || '',
      rec.favorecido || '',
      formattedValue,
      rec.status === 'sucesso' ? 'Identificado' : (rec.status === 'atencao' ? 'Atenção / Manual' : 'Erro'),
      rec.notes || ''
    ];
  });

  const csvContent = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(';'),
    ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(';'))
  ].join('\r\n');

  // Adiciona BOM (\uFEFF) para garantir que o Microsoft Excel abra em UTF-8 com acentuação correta
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const today = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `relatorio_comprovantes_${today}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 200);
}
