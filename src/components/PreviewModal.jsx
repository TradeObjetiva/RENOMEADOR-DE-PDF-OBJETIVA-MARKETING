import React, { useEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export default function PreviewModal({ record, onClose }) {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!record || !record.pdfDoc) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    async function renderPage() {
      try {
        const page = await record.pdfDoc.getPage(1);
        if (!isMounted) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        if (isMounted) setLoading(false);
      } catch (err) {
        console.error('Erro no preview:', err);
        if (isMounted) {
          setError('Falha ao renderizar a visualização deste documento.');
          setLoading(false);
        }
      }
    }

    renderPage();

    return () => {
      isMounted = false;
    };
  }, [record, scale]);

  if (!record) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <div className="modal-heading">
            <span className="modal-doc-name">{record.originalName}</span>
            <span className="modal-doc-sub">Visualização da Página 1</span>
          </div>

          <div className="modal-controls">
            <button
              type="button"
              className="modal-tool-btn"
              onClick={() => setScale(s => Math.min(2.5, s + 0.2))}
              title="Aumentar Zoom"
            >
              <ZoomIn size={16} />
            </button>
            <button
              type="button"
              className="modal-tool-btn"
              onClick={() => setScale(s => Math.max(0.6, s - 0.2))}
              title="Diminuir Zoom"
            >
              <ZoomOut size={16} />
            </button>
            <button
              type="button"
              className="modal-tool-btn"
              onClick={() => setScale(1.2)}
              title="Restaurar Zoom"
            >
              <RotateCcw size={16} />
            </button>
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              title="Fechar (ESC)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-canvas-area">
          {loading && <div className="modal-loader">Carregando visualização do PDF...</div>}
          {error && <div className="modal-error">{error}</div>}
          <canvas ref={canvasRef} className="preview-pdf-canvas" />
        </div>
      </div>
    </div>
  );
}
