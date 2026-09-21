import React from 'react';
import { Eye, Download, Trash2, FileText, Image as ImageIcon } from 'lucide-react';

export default function FileCard({
  record,
  targetFilename,
  onUpdateRecord,
  onDeleteRecord,
  onPreview,
  onDownloadSingle
}) {
  const handleDateChange = (e) => {
    onUpdateRecord(record.id, { date: e.target.value });
  };

  const handleFavorecidoChange = (e) => {
    onUpdateRecord(record.id, { favorecido: e.target.value });
  };

  const handleValueChange = (e) => {
    const val = parseFloat(e.target.value);
    onUpdateRecord(record.id, { value: isNaN(val) ? null : val });
  };

  const handleDocTypeChange = (e) => {
    onUpdateRecord(record.id, { docType: e.target.value });
  };

  return (
    <div className={`file-card-item status-border-${record.status}`}>
      {/* Coluna 1: Nome Original & Tipo */}
      <div className="file-col-orig">
        <div className="file-orig-title" title={record.originalName}>
          <FileText size={16} className="pdf-icon" />
          <span className="file-name-text">{record.originalName}</span>
        </div>
        <div className="badge-row">
          <select
            className="doc-type-badge"
            value={record.docType || 'COMPROVANTE'}
            onChange={handleDocTypeChange}
            title="Alterar tipo de documento"
          >
            <option value="PIX">⚡ PIX</option>
            <option value="BOLETO">📄 BOLETO</option>
            <option value="NFE">🧾 NF-E / DANFE</option>
            <option value="FATURA">💳 FATURA</option>
            <option value="TRANSFERENCIA">🏛️ TED / DOC</option>
            <option value="COMPROVANTE">📁 COMPROVANTE</option>
          </select>

          {record.isScanned && (
            <span className="scanned-pill" title="Documento escaneado em imagem (sem texto nativo)">
              <ImageIcon size={11} /> Scan
            </span>
          )}

          {record.status === 'sucesso' && (
            <span className="status-pill status-pill-success">Identificado</span>
          )}
          {record.status === 'atencao' && (
            <span className="status-pill status-pill-warning" title={record.notes}>
              Revisar
            </span>
          )}
          {record.status === 'erro' && (
            <span className="status-pill status-pill-danger" title={record.notes}>
              Erro
            </span>
          )}
        </div>
      </div>

      {/* Coluna 2: Data */}
      <div className="file-col">
        <label className="mobile-only-label">Data:</label>
        <input
          type="date"
          className="card-input"
          value={record.date || ''}
          onChange={handleDateChange}
        />
      </div>

      {/* Coluna 3: Favorecido */}
      <div className="file-col">
        <label className="mobile-only-label">Favorecido / Destino:</label>
        <input
          type="text"
          className="card-input"
          placeholder="Ex: CEMIG, Fornecedor..."
          value={record.favorecido || ''}
          onChange={handleFavorecidoChange}
        />
      </div>

      {/* Coluna 4: Valor */}
      <div className="file-col">
        <label className="mobile-only-label">Valor (R$):</label>
        <input
          type="number"
          step="0.01"
          className="card-input text-right"
          placeholder="0,00"
          value={record.value !== null && record.value !== undefined ? record.value : ''}
          onChange={handleValueChange}
        />
      </div>

      {/* Coluna 5: Novo Nome Gerado */}
      <div className="file-col-target">
        <label className="mobile-only-label">Novo Nome:</label>
        <div className="generated-filename" title={targetFilename}>
          {targetFilename}
        </div>
      </div>

      {/* Coluna 6: Ações */}
      <div className="file-col-actions">
        <button
          type="button"
          className="action-icon-btn"
          title="Pré-visualizar PDF"
          onClick={() => onPreview(record)}
        >
          <Eye size={15} />
        </button>

        <button
          type="button"
          className="action-icon-btn"
          title="Baixar este arquivo individualmente"
          onClick={() => onDownloadSingle(record)}
        >
          <Download size={15} />
        </button>

        <button
          type="button"
          className="action-icon-btn btn-delete"
          title="Remover este arquivo da lista"
          onClick={() => onDeleteRecord(record.id)}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
