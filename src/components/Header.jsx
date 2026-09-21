import React from 'react';
import { FileText, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="badge-tag">
        <Sparkles size={14} className="sparkle-icon" />
        <span>Comprovantes Bancários • Boletos • NF-e • Faturas</span>
      </div>
      <h1 className="title-gradient">Renomeador Inteligente de PDFs</h1>
      <p className="subtitle">
        Extraia data, valor e favorecido automaticamente com inteligência contextual e renomeie centenas de comprovantes em lote com privacidade 100% local.
      </p>
    </header>
  );
}
