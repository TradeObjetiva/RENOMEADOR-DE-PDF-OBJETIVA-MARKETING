import React from 'react';
import { Files, DollarSign, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function DashboardKPIs({ records }) {
  if (!records || records.length === 0) return null;

  const totalFiles = records.length;
  const successCount = records.filter(r => r.status === 'sucesso').length;
  const reviewCount = records.filter(r => r.status === 'atencao' || r.status === 'erro').length;

  const totalValue = records.reduce((acc, r) => {
    return acc + (r.value && !isNaN(r.value) ? Number(r.value) : 0);
  }, 0);

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(totalValue);

  return (
    <div className="kpis-grid">
      <div className="kpi-card">
        <div className="kpi-icon-wrapper icon-files">
          <Files size={20} />
        </div>
        <div className="kpi-content">
          <span className="kpi-label">Total de Documentos</span>
          <span className="kpi-value">{totalFiles}</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon-wrapper icon-money">
          <DollarSign size={20} />
        </div>
        <div className="kpi-content">
          <span className="kpi-label">Soma Financeira Detectada</span>
          <span className="kpi-value highlight-money">{formattedTotal}</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon-wrapper icon-success">
          <CheckCircle2 size={20} />
        </div>
        <div className="kpi-content">
          <span className="kpi-label">Identificados com Sucesso</span>
          <span className="kpi-value text-success">{successCount}</span>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon-wrapper icon-warning">
          <AlertTriangle size={20} />
        </div>
        <div className="kpi-content">
          <span className="kpi-label">Atenção / Para Revisar</span>
          <span className="kpi-value text-warning">{reviewCount}</span>
        </div>
      </div>
    </div>
  );
}
