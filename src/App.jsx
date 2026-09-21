import React, { useState, useEffect, useMemo, useCallback } from 'react';
import JSZip from 'jszip';
import Header from './components/Header';
import DashboardKPIs from './components/DashboardKPIs';
import ConfigPanel from './components/ConfigPanel';
import DropZone from './components/DropZone';
import ProgressBar from './components/ProgressBar';
import ActionsBar from './components/ActionsBar';
import FilterBar from './components/FilterBar';
import FileTable from './components/FileTable';
import PreviewModal from './components/PreviewModal';

import { extractPdfData } from './utils/pdfExtractor';
import { generateFilename } from './utils/filenameGenerator';
import { exportToCsv } from './utils/csvExporter';
import './App.css';

export default function App() {
  // Configurações persistidas no LocalStorage
  const [pattern, setPattern] = useState(() => {
    return localStorage.getItem('pdf_renamer_pattern') || '{data}_{favorecido}_{valor}';
  });
  const [preset, setPreset] = useState(() => {
    return localStorage.getItem('pdf_renamer_preset') || '{data}_{favorecido}_{valor}';
  });
  const [dateFormat, setDateFormat] = useState(() => {
    return localStorage.getItem('pdf_renamer_date_fmt') || 'YYYY-MM-DD';
  });
  const [currencyFormat, setCurrencyFormat] = useState(() => {
    return localStorage.getItem('pdf_renamer_curr_fmt') || 'safe';
  });

  useEffect(() => {
    localStorage.setItem('pdf_renamer_pattern', pattern);
  }, [pattern]);

  useEffect(() => {
    localStorage.setItem('pdf_renamer_preset', preset);
  }, [preset]);

  useEffect(() => {
    localStorage.setItem('pdf_renamer_date_fmt', dateFormat);
  }, [dateFormat]);

  useEffect(() => {
    localStorage.setItem('pdf_renamer_curr_fmt', currencyFormat);
  }, [currencyFormat]);

  // Arquivos e Registros
  const [rawFiles, setRawFiles] = useState([]);
  const [records, setRecords] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(null);
  const [currentFileName, setCurrentFileName] = useState('');
  const [isZipping, setIsZipping] = useState(false);

  // Filtros e Busca
  const [activeFilter, setActiveFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal de Preview
  const [previewRecord, setPreviewRecord] = useState(null);

  // Manipulação dos arquivos selecionados
  const handleFilesSelected = (newFiles) => {
    setRawFiles(newFiles);
    setRecords([]);
    setProgress(null);
  };

  const handleClear = () => {
    setRawFiles([]);
    setRecords([]);
    setProgress(null);
    setCurrentFileName('');
    setPreviewRecord(null);
  };

  // Gerador de nome de destino memoizado
  const getFilename = useCallback((record) => {
    return generateFilename(record, pattern, dateFormat, currencyFormat);
  }, [pattern, dateFormat, currencyFormat]);

  // Processamento dos PDFs
  const handleProcess = async () => {
    if (rawFiles.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setProgress(0);
    const newRecords = [];
    const total = rawFiles.length;

    for (let i = 0; i < total; i++) {
      const file = rawFiles[i];
      setCurrentFileName(file.name);
      setProgress(((i + 1) / total) * 100);

      try {
        const extracted = await extractPdfData(file);
        newRecords.push({
          id: `rec-${Date.now()}-${i}`,
          file,
          pdfDoc: extracted.pdfDoc,
          originalName: file.name,
          docType: extracted.docType,
          date: extracted.date,
          value: extracted.value,
          favorecido: extracted.favorecido,
          status: extracted.status,
          notes: extracted.notes,
          isScanned: extracted.isScanned
        });
      } catch (err) {
        console.error('Erro ao ler PDF:', file.name, err);
        newRecords.push({
          id: `rec-${Date.now()}-${i}`,
          file,
          pdfDoc: null,
          originalName: file.name,
          docType: 'COMPROVANTE',
          date: '',
          value: null,
          favorecido: '',
          status: 'erro',
          notes: 'Erro de leitura: ' + err.message,
          isScanned: false
        });
      }
    }

    setRecords(newRecords);
    setIsProcessing(false);
  };

  // Edição em tempo real de um registro
  const handleUpdateRecord = (id, updates) => {
    setRecords(prev => prev.map(rec => {
      if (rec.id === id) {
        return { ...rec, ...updates };
      }
      return rec;
    }));
  };

  // Excluir um registro da lista
  const handleDeleteRecord = (id) => {
    setRecords(prev => prev.filter(rec => rec.id !== id));
  };

  // Baixar um arquivo individualmente
  const handleDownloadSingle = (record) => {
    if (!record || !record.file) return;
    const targetName = getFilename(record);
    const url = URL.createObjectURL(record.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = targetName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 300);
  };

  // Baixar todos em ZIP
  const handleDownloadZip = async () => {
    if (records.length === 0 || isZipping) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      const usedNames = new Set();

      for (const rec of records) {
        if (!rec.file) continue;

        let targetName = getFilename(rec);

        // Previne duplicidades dentro do arquivo ZIP
        if (usedNames.has(targetName)) {
          let counter = 2;
          const base = targetName.replace(/\.pdf$/i, '');
          while (usedNames.has(`${base}_(${counter}).pdf`)) {
            counter++;
          }
          targetName = `${base}_(${counter}).pdf`;
        }
        usedNames.add(targetName);

        const buffer = await rec.file.arrayBuffer();
        zip.file(targetName, buffer);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      const today = new Date().toISOString().slice(0, 10);
      a.href = zipUrl;
      a.download = `comprovantes_renomeados_${today}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(zipUrl), 400);

    } catch (err) {
      alert('Erro ao gerar o arquivo ZIP: ' + err.message);
    } finally {
      setIsZipping(false);
    }
  };

  // Exportar Relatório CSV
  const handleExportCsv = () => {
    exportToCsv(records, getFilename);
  };

  // Registros filtrados e buscados
  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      // Filtro por status
      if (activeFilter === 'sucesso' && rec.status !== 'sucesso') return false;
      if (activeFilter === 'atencao' && rec.status !== 'atencao') return false;
      if (activeFilter === 'erro' && rec.status !== 'erro') return false;

      // Filtro por busca
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const orig = (rec.originalName || '').toLowerCase();
        const fav = (rec.favorecido || '').toLowerCase();
        const val = rec.value !== null && rec.value !== undefined ? String(rec.value) : '';
        const docType = (rec.docType || '').toLowerCase();

        return orig.includes(query) || fav.includes(query) || val.includes(query) || docType.includes(query);
      }

      return true;
    });
  }, [records, activeFilter, searchQuery]);

  // Contagens para os filtros
  const counts = useMemo(() => {
    return {
      total: records.length,
      sucesso: records.filter(r => r.status === 'sucesso').length,
      atencao: records.filter(r => r.status === 'atencao').length,
      erro: records.filter(r => r.status === 'erro').length
    };
  }, [records]);

  return (
    <div className="app-layout">
      <div className="app-container">
        <Header />

        <ConfigPanel
          pattern={pattern}
          setPattern={setPattern}
          preset={preset}
          setPreset={setPreset}
          dateFormat={dateFormat}
          setDateFormat={setDateFormat}
          currencyFormat={currencyFormat}
          setCurrencyFormat={setCurrencyFormat}
        />

        <DropZone
          onFilesSelected={handleFilesSelected}
          selectedCount={rawFiles.length}
        />

        <ActionsBar
          hasFiles={rawFiles.length > 0}
          hasRecords={records.length > 0}
          isProcessing={isProcessing}
          isZipping={isZipping}
          onClear={handleClear}
          onProcess={handleProcess}
          onDownloadZip={handleDownloadZip}
          onExportCsv={handleExportCsv}
        />

        <ProgressBar
          progress={progress}
          currentFileName={currentFileName}
        />

        <DashboardKPIs records={records} />

        {records.length > 0 && (
          <div className="results-section">
            <FilterBar
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              counts={counts}
            />

            <FileTable
              records={filteredRecords}
              getFilename={getFilename}
              onUpdateRecord={handleUpdateRecord}
              onDeleteRecord={handleDeleteRecord}
              onPreview={setPreviewRecord}
              onDownloadSingle={handleDownloadSingle}
            />
          </div>
        )}

        <PreviewModal
          record={previewRecord}
          onClose={() => setPreviewRecord(null)}
        />

        <footer className="app-footer">
          <span>Criado por Fabiano Pereira</span>
          <span>•</span>
          <span>FP AUTOMATION</span>
        </footer>
      </div>
    </div>
  );
}
