import React from 'react';

export default function ProgressBar({ progress, currentFileName }) {
  if (progress === null) return null;

  return (
    <div className="progress-container">
      <div className="progress-details">
        <span className="progress-status-text">
          {progress >= 100 ? 'Processamento concluído!' : `Processando: ${currentFileName || 'Analisando documento...'}`}
        </span>
        <span className="progress-percentage">{Math.round(progress)}%</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
