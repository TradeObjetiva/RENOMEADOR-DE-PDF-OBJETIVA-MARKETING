import React from 'react';
import FileCard from './FileCard';

export default function FileTable({
  records,
  getFilename,
  onUpdateRecord,
  onDeleteRecord,
  onPreview,
  onDownloadSingle
}) {
  if (!records || records.length === 0) {
    return (
      <div className="empty-results">
        Nenhum documento encontrado para este filtro ou busca.
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <div className="table-column-headers">
        <div>Arquivo Original & Tipo</div>
        <div>Data Transação</div>
        <div>Favorecido / Destinatário</div>
        <div>Valor (R$)</div>
        <div>Novo Nome Gerado</div>
        <div style={{ textAlign: 'right' }}>Ações</div>
      </div>

      <div className="table-cards-list">
        {records.map(record => (
          <FileCard
            key={record.id}
            record={record}
            targetFilename={getFilename(record)}
            onUpdateRecord={onUpdateRecord}
            onDeleteRecord={onDeleteRecord}
            onPreview={onPreview}
            onDownloadSingle={onDownloadSingle}
          />
        ))}
      </div>
    </div>
  );
}
