import React, { useRef, useState } from 'react';
import { UploadCloud, FileCheck } from 'lucide-react';

export default function DropZone({ onFilesSelected, selectedCount }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      const pdfs = Array.from(e.dataTransfer.files).filter(
        f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
      );
      if (pdfs.length > 0) {
        onFilesSelected(pdfs);
      }
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files) {
      const pdfs = Array.from(e.target.files).filter(
        f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
      );
      if (pdfs.length > 0) {
        onFilesSelected(pdfs);
      }
    }
  };

  return (
    <div
      className={`dropzone-container ${isDragOver ? 'dragover' : ''}`}
      onClick={() => fileInputRef.current?.click()}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        multiple
        className="hidden-file-input"
        onChange={handleInputChange}
      />
      <div className="dropzone-icon">
        {selectedCount > 0 ? <FileCheck size={32} /> : <UploadCloud size={32} />}
      </div>
      <div className="dropzone-title">
        {selectedCount > 0
          ? `${selectedCount} arquivo(s) PDF selecionado(s)`
          : 'Arraste seus comprovantes e notas fiscais em PDF aqui'}
      </div>
      <div className="dropzone-subtitle">
        ou clique em qualquer lugar para selecionar múltiplos arquivos do seu computador
      </div>
    </div>
  );
}
