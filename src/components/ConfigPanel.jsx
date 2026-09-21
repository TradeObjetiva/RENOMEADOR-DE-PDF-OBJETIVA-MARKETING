import React, { useMemo } from 'react';
import { Sliders, Calendar, DollarSign, Sparkles, Plus, Eye, RefreshCw } from 'lucide-react';
import { generateFilename } from '../utils/filenameGenerator';

export default function ConfigPanel({
  pattern,
  setPattern,
  preset,
  setPreset,
  dateFormat,
  setDateFormat,
  currencyFormat,
  setCurrencyFormat
}) {
  const presets = [
    { value: '{data}_{favorecido}_{valor}', label: 'Data + Favorecido + Valor (Recomendado)' },
    { value: '{data}_{tipo}_{favorecido}_{valor}', label: 'Data + Tipo + Favorecido + Valor' },
    { value: '{data}_valor_{valor}', label: 'Data + Valor' },
    { value: '{data}_{valor}_{origem}', label: 'Data + Valor + Nome Original' },
    { value: '{tipo}_{data}_{favorecido}_{valor}', label: 'Tipo + Data + Favorecido + Valor' },
    { value: 'custom', label: 'Personalizado (Fórmula Livre)...' }
  ];

  const handlePresetChange = (e) => {
    const val = e.target.value;
    setPreset(val);
    if (val !== 'custom') {
      setPattern(val);
    }
  };

  const handlePatternChange = (e) => {
    setPattern(e.target.value);
    setPreset('custom');
  };

  const addTag = (tag) => {
    setPattern(prev => {
      // Se já tiver algo e não terminar com underline ou traço, adiciona underline
      const needsSeparator = prev.length > 0 && !prev.endsWith('_') && !prev.endsWith('-') && !prev.endsWith(' ');
      return prev + (needsSeparator ? '_' : '') + tag;
    });
    setPreset('custom');
  };

  // Exemplo em tempo real de como o arquivo ficará
  const examplePreview = useMemo(() => {
    const mock = {
      date: '2026-09-21',
      favorecido: 'FORNECEDOR_EXEMPLO',
      docType: 'PIX',
      value: 249.90,
      originalName: 'comprovante_itau_01.pdf'
    };
    return generateFilename(mock, pattern, dateFormat, currencyFormat);
  }, [pattern, dateFormat, currencyFormat]);

  return (
    <div className="config-card">
      <div className="config-card-header">
        <div className="config-title-group">
          <div className="config-icon-badge">
            <Sliders size={18} />
          </div>
          <div>
            <h3 className="config-title">Configurações da Máscara do Novo Nome</h3>
            <p className="config-desc">Personalize como seus comprovantes serão renomeados automaticamente</p>
          </div>
        </div>

        {preset === 'custom' && (
          <button
            type="button"
            className="btn-reset-preset"
            onClick={() => {
              setPreset('{data}_{favorecido}_{valor}');
              setPattern('{data}_{favorecido}_{valor}');
            }}
            title="Voltar ao padrão recomendado"
          >
            <RefreshCw size={13} />
            <span>Restaurar Padrão</span>
          </button>
        )}
      </div>

      {/* Linha 1: Seletores de Configuração (Perfeitamente alinhados) */}
      <div className="config-controls-row">
        {/* Controle 1: Modelo Pré-definido */}
        <div className="control-box">
          <label htmlFor="preset-select" className="control-label">
            <Sparkles size={14} className="label-icon text-indigo" />
            <span>Modelo Pré-definido</span>
          </label>
          <div className="select-wrapper">
            <select id="preset-select" value={preset} onChange={handlePresetChange}>
              {presets.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Controle 2: Formato da Data */}
        <div className="control-box">
          <label htmlFor="date-format" className="control-label">
            <Calendar size={14} className="label-icon text-emerald" />
            <span>Formato da Data</span>
          </label>
          <div className="select-wrapper">
            <select id="date-format" value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
              <option value="YYYY-MM-DD">AAAA-MM-DD (ISO / Ordenação)</option>
              <option value="DD-MM-YYYY">DD-MM-AAAA (Padrão BR)</option>
              <option value="YYYYMMDD">AAAAMMDD (Compacto)</option>
            </select>
          </div>
        </div>

        {/* Controle 3: Formato do Valor */}
        <div className="control-box">
          <label htmlFor="currency-format" className="control-label">
            <DollarSign size={14} className="label-icon text-amber" />
            <span>Formato do Valor</span>
          </label>
          <div className="select-wrapper">
            <select id="currency-format" value={currencyFormat} onChange={(e) => setCurrencyFormat(e.target.value)}>
              <option value="safe">150.00 (Sem R$ - Recomendado)</option>
              <option value="br">R$150,00 (Com R$ e vírgula)</option>
              <option value="clean">150_00 (Underline)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Linha 2: Construtor de Fórmula + Tags + Preview ao Vivo */}
      <div className="pattern-builder-box">
        <div className="builder-top-line">
          <div className="builder-input-group">
            <label htmlFor="custom-pattern" className="builder-label">
              Fórmula do Nome:
            </label>
            <div className="input-with-extension">
              <input
                id="custom-pattern"
                type="text"
                value={pattern}
                onChange={handlePatternChange}
                placeholder="{data}_{favorecido}_{valor}"
                className="pattern-text-input"
              />
              <span className="file-extension-badge">.pdf</span>
            </div>
          </div>

          {/* Preview ao vivo */}
          <div className="live-preview-container">
            <div className="live-preview-label">
              <Eye size={13} />
              <span>Exemplo em tempo real:</span>
            </div>
            <div className="live-preview-pill" title={examplePreview}>
              {examplePreview}
            </div>
          </div>
        </div>

        {/* Tags / Variáveis clicáveis */}
        <div className="variables-bar">
          <span className="variables-prompt">Inserir variável:</span>
          <div className="tags-container">
            <button
              type="button"
              className="tag-chip"
              onClick={() => addTag('{data}')}
              title="Adicionar variável de Data"
            >
              <Plus size={12} /> &#123;data&#125;
            </button>
            <button
              type="button"
              className="tag-chip"
              onClick={() => addTag('{tipo}')}
              title="Adicionar variável de Tipo de Documento (PIX, BOLETO, NFE...)"
            >
              <Plus size={12} /> &#123;tipo&#125;
            </button>
            <button
              type="button"
              className="tag-chip"
              onClick={() => addTag('{favorecido}')}
              title="Adicionar variável de Favorecido / Beneficiário"
            >
              <Plus size={12} /> &#123;favorecido&#125;
            </button>
            <button
              type="button"
              className="tag-chip"
              onClick={() => addTag('{valor}')}
              title="Adicionar variável de Valor Financeiro"
            >
              <Plus size={12} /> &#123;valor&#125;
            </button>
            <button
              type="button"
              className="tag-chip"
              onClick={() => addTag('{origem}')}
              title="Adicionar Nome Original do Arquivo"
            >
              <Plus size={12} /> &#123;origem&#125;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
