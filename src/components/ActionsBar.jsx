import React from 'react';
import { Trash2, Play, DownloadCloud, FileSpreadsheet, Loader2 } from 'lucide-react';

export default function ActionsBar({
  hasFiles,
  hasRecords,
  isProcessing,
  isZipping,
  onClear,
  onProcess,
  onDownloadZip,
  onExportCsv
}) {
  return (
    <div className="actions-toolbar">
      <div className="toolbar-status">
        {hasRecords && (
          <span className="ready-indicator">
            Pronto para conferência e download
          </span>
        )}
      </div>

      <div className="toolbar-buttons">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClear}
          disabled={!hasFiles || isProcessing || isZipping}
          title="Limpar todos os arquivos carregados"
        >
          <Trash2 size={16} />
          <span>Limpar Tudo</span>
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onProcess}
          disabled={!hasFiles || isProcessing || isZipping}
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="spinner" />
              <span>Analisando PDFs...</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>Processar PDFs</span>
            </>
          )}
        </button>

        {hasRecords && (
          <>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onExportCsv}
              disabled={isProcessing || isZipping}
              title="Exportar dados estruturados para o Microsoft Excel"
            >
              <FileSpreadsheet size={16} />
              <span>Exportar Planilha (CSV)</span>
            </button>

            <button
              type="button"
              className="btn btn-success"
              onClick={onDownloadZip}
              disabled={isProcessing || isZipping}
              title="Baixar todos os arquivos renomeados em um único arquivo compactado"
            >
              {isZipping ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  <span>Compactando ZIP...</span>
                </>
              ) : (
                <>
                  <DownloadCloud size={16} />
                  <span>Baixar Todos (.ZIP)</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
