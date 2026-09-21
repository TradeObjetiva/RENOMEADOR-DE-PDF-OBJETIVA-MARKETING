import React from 'react';
import { Search, ListFilter } from 'lucide-react';

export default function FilterBar({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  counts
}) {
  return (
    <div className="filter-bar">
      <div className="filter-tabs">
        <button
          type="button"
          className={`filter-tab ${activeFilter === 'todos' ? 'active' : ''}`}
          onClick={() => setActiveFilter('todos')}
        >
          Todos ({counts.total})
        </button>
        <button
          type="button"
          className={`filter-tab ${activeFilter === 'sucesso' ? 'active' : ''}`}
          onClick={() => setActiveFilter('sucesso')}
        >
          <span className="dot dot-success"></span>
          Identificados ({counts.sucesso})
        </button>
        <button
          type="button"
          className={`filter-tab ${activeFilter === 'atencao' ? 'active' : ''}`}
          onClick={() => setActiveFilter('atencao')}
        >
          <span className="dot dot-warning"></span>
          Para Revisar ({counts.atencao})
        </button>
        {counts.erro > 0 && (
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'erro' ? 'active' : ''}`}
            onClick={() => setActiveFilter('erro')}
          >
            <span className="dot dot-danger"></span>
            Erros ({counts.erro})
          </button>
        )}
      </div>

      <div className="search-box">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por nome, favorecido ou valor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-search"
            onClick={() => setSearchQuery('')}
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
}
