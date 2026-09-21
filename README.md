# 📄 Renomeador Inteligente de PDFs Financeiros & Fiscais

[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![PDF.js](https://img.shields.io/badge/PDF.js-Client--Side-ff0000?style=for-the-badge&logo=adobeacrobatreader)](https://mozilla.github.io/pdf.js/)
[![LGPD Safe](https://img.shields.io/badge/LGPD-100%25%20Privacidade-10b981?style=for-the-badge&logo=shield)](https://github.com/)

> **Automatize a triagem, extração de metadados e renomeação em lote de centenas de comprovantes bancários e fiscais em segundos, com processamento 100% seguro e local no navegador.**

---

## 🎯 O Problema que este Sistema Resolve

Rotinas financeiras, contábeis e fiscais exigem a organização periódica de dezenas ou centenas de documentos (comprovantes PIX, boletos, DANFEs de notas fiscais, faturas e transferências bancárias). Tradicionalmente, esse processo é feito de forma manual:
- Abrir arquivo por arquivo;
- Identificar quem recebeu ou pagou;
- Encontrar a data e o valor da operação;
- Renomear arquivo por arquivo e organizar nas pastas.

Esse trabalho manual consome horas, é monótono e suscetível a erros de digitação.

O **Renomeador Inteligente de PDFs** elimina esse gargalo operacional, realizando a leitura, extração inteligente dos campos e geração de um arquivo compactado (**`.ZIP`**) com todos os arquivos perfeitamente renomeados com um único clique.

---

## ✨ Principais Funcionalidades

- ⚡ **Processamento em Lote com Drag & Drop:** Arraste múltiplos PDFs de uma só vez para a tela.
- 🧠 **Motor de Extração Contextual Heurística:**
  - Identifica datas (pagamento, emissão ou vencimento).
  - Identifica o favorecido/beneficiário/razão social.
  - Detecta o valor financeiro exato da operação, descartando falsos positivos de sequências longas como **CNPJs, CPFs, códigos de barras e linhas digitáveis**.
  - Reconhece e classifica o tipo de documento (**PIX, Boleto, NF-e / DANFE, Fatura, TED/DOC**).
  - Alerta sobre documentos digitalizados/escaneados que não possuem camada nativa de texto.
- ⚙️ **Máscara de Nomenclatura Personalizável & Live Preview:**
  - Modelos pré-configurados (ex: `Data + Favorecido + Valor`, `Data + Tipo + Favorecido + Valor`).
  - Construtor com tags clicáveis: `{data}`, `{tipo}`, `{favorecido}`, `{valor}`, `{origem}`.
  - Visualização em tempo real de como o arquivo final ficará.
  - Opções de formatação de data (`AAAA-MM-DD`, `DD-MM-AAAA` ou `AAAAMMDD`) e moeda (`150.00`, `R$150,00` ou `150_00`).
- ✍️ **Conferência e Edição Direta (In-Place Editing):**
  - Tabela interativa com todos os dados extraídos.
  - Possibilidade de editar a data, favorecido, valor ou tipo de documento antes de exportar.
- 📊 **Exportação de Planilha para Conciliação (CSV / Excel):**
  - Exporta com 1 clique uma planilha completa contendo `Nome Original`, `Novo Nome`, `Tipo`, `Data`, `Favorecido`, `Valor (R$)` e `Status`, com codificação UTF-8 BOM pronta para o Microsoft Excel.
- 📦 **Download em Lote (.ZIP):**
  - Compacta e renomeia todos os PDFs processados com tratamento automático contra nomes duplicados (`JSZip`).
- 👁️ **Visualizador Rápido de PDF (Preview):**
  - Renderização direta da página do documento em HTML5 Canvas com controle de zoom e atalho `ESC`.
- 🔒 **100% Client-Side & Conforme com a LGPD:**
  - Nenhum documento ou dado financeiro é transmitido para a nuvem ou servidores externos. Tudo é processado estritamente na memória do seu navegador.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React 19](https://react.dev/)
- **Build Tool & Dev Server:** [Vite 8](https://vitejs.dev/)
- **Parser de Documentos:** [PDF.js (Mozilla)](https://mozilla.github.io/pdf.js/)
- **Manipulação de Arquivos ZIP:** [JSZip](https://stuk.github.io/jszip/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Estilização:** CSS3 Moderno (Glassmorphism, Variáveis CSS, Grid/Flexbox Responsivo)
- **Tipografia:** Google Fonts (Plus Jakarta Sans)

---

## 📁 Estrutura do Projeto

```text
├── index.html                   # Entry point HTML com carregamento do PDF.js
├── package.json                 # Dependências e scripts do projeto
├── vite.config.js               # Configuração do Vite com plugin do React
└── src/
    ├── main.jsx                 # Inicialização do React
    ├── App.jsx                  # Estado global e fluxo principal
    ├── App.css                  # Estilização completa e responsiva
    ├── index.css                # Tokens de design, fontes e temas
    ├── components/
    │   ├── Header.jsx           # Cabeçalho da aplicação
    │   ├── ConfigPanel.jsx      # Painel de fórmulas, tags e Live Preview
    │   ├── DashboardKPIs.jsx    # Métricas de totais, soma financeira e status
    │   ├── DropZone.jsx         # Área interativa de Drag & Drop
    │   ├── ActionsBar.jsx       # Botões de ação (Processar, ZIP, CSV, Limpar)
    │   ├── ProgressBar.jsx      # Indicador de progresso em tempo real
    │   ├── FilterBar.jsx        # Abas de filtro e busca instantânea
    │   ├── FileTable.jsx        # Tabela de resultados
    │   ├── FileCard.jsx         # Card individual com edição in-place
    │   └── PreviewModal.jsx     # Modal com renderização do PDF em Canvas
    └── utils/
        ├── pdfExtractor.js      # Heurísticas de extração de texto, regex e tipos
        ├── filenameGenerator.js # Formatador e higienizador de nomes de arquivo
        └── csvExporter.js       # Gerador de planilha CSV com encoding UTF-8 BOM
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js instalado (v18 ou superior).

### Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/TradeObjetiva/RENOMEADOR-DE-PDF-OBJETIVA-MARKETING.git
   cd RENOMEADOR-DE-PDF-OBJETIVA-MARKETING
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. Abra no seu navegador o endereço indicado (geralmente `http://localhost:5173`).

---

## 📦 Gerar Build de Produção

Para gerar a versão estática otimizada para deploy:

```bash
npm run build
```

Os arquivos compilados prontos para hospedagem (Vercel, Netlify, GitHub Pages, etc.) estarão na pasta `dist/`.

---

## 👨‍💻 Autoria e Créditos

Desenvolvido por **Fabiano Pereira**  
**FP AUTOMATION** / **Objetiva Marketing**

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para mais detalhes.
