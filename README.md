# Handoff: Landing Page OCR Automático para N.H. Brandão Advogados

## Overview

Landing page de alta conversão para captação de clientes interessados em analisar possíveis cobranças bancárias indevidas do Itaú. A página inclui:

- **Frontend interativo** com upload de faturas/extratos
- **OCR automático** usando Tesseract.js (extrai texto do documento)
- **API backend** que analisa cobranças automaticamente
- **Integração com email** para envio de resultados
- **Banco de dados PostgreSQL** para armazenar análises
- **Design premium** com cores da marca (navy #2C3E50 + gold #B8956A)

## About the Design Files

Os arquivos HTML neste pacote são **protótipos de design** mostrando a aparência e comportamento final. O objetivo é **recriá-los em um projeto real** usando as melhores práticas do seu ambiente:

- **Frontend:** Próxima.js + React (recomendado) ou manter HTML puro
- **Backend:** Node.js + Vercel (serverless)
- **Banco:** Supabase PostgreSQL
- **Email:** SendGrid ou Gmail SMTP

## Fidelity

**High-fidelity (Hifi)** — Design completo com:
- Cores exatas, tipografia, espaçamento
- Animações (fade-ins, hover states, transições)
- Responsividade mobile-first
- Comportamento interativo (upload, OCR, validação de formulário)
- Estados de sucesso/erro

## Arquitetura Técnica

```
┌─────────────────────────────────────────────────────────┐
│           Frontend (HTML/JS/CSS)                         │
│  - Landing page responsiva                              │
│  - Tesseract.js para OCR (roda no navegador)           │
│  - Formulário com upload de arquivo                     │
│  - Modal mostrando resultado da análise                 │
└──────────────┬──────────────────────────────────────────┘
               │ POST /api/analyze
               ↓
┌─────────────────────────────────────────────────────────┐
│      Backend (Node.js/TypeScript + Vercel)             │
│  - Processa texto extraído pelo OCR                    │
│  - Busca keywords (seguro, tarifa, cesta, etc)        │
│  - Calcula confiança (0-100%)                          │
│  - Envia email com resultado                           │
│  - Salva no Supabase                                   │
└──────────────┬──────────────────────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────────────────────┐
│        Supabase PostgreSQL                              │
│  - Tabela: analyses                                    │
│    - client_name, email, cpf, phone                   │
│    - extracted_text (texto do OCR)                    │
│    - detected_charges (JSON com cobranças)            │
│    - confidence_score (média de confiança)            │
└─────────────────────────────────────────────────────────┘
```

## Screens / Views

### 1. Landing Page Principal (index.html)

**Propósito:** Captar contatos qualificados e processar uploads de documentos com OCR

**Sections:**

#### 1.1 Header Fixo
- **Logo:** `logo-nhb-transparent.png` (100px altura)
- **Navegação:** Links para seções (Como funciona, Documentos, FAQ, Fale conosco)
- **CTA:** Botão "Enviar fatura para análise"
- **Cor:** Background `rgba(15, 20, 25, 0.95)` com blur backdrop
- **Responsivo:** Menu hamburger no mobile

#### 1.2 Hero Section
- **Grid:** 2 colunas (texto + visual mockup), stacked no mobile
- **Texto:**
  - H1: "Cobranças do Itaú no seu cartão ou conta podem estar sendo debitadas **sem a sua percepção**" (gold em negrito)
  - Parágrafo descritivo (cor muted)
  - Bullets com checkmarks (4 itens)
- **Botões:**
  - Primary (gold gradient): "Quero analisar minhas cobranças"
  - Secondary (border gold): "Falar com a equipe pelo WhatsApp"
- **Visual:** Card mockup de fatura com itens destacados em laranja (alert color)
- **Disclaimer:** "A análise inicial depende dos documentos enviados..."

#### 1.3 Seção Pain/Alert
- **H2:** "Você sabe exatamente o que está pagando todo mês?"
- **Grid:** 6 cards em responsivo (minmax 280px)
- **Cada card:**
  - Ícone emoji (2rem)
  - H3 título (gold)
  - Parágrafo descrição (muted)
  - Hover: borda gold, transform: translateY(-4px)
  - Transição suave 0.3s

#### 1.4 Urgency Section
- **Card:** Background navy-dark com border subtle
- **Conteúdo:** H2 + parágrafo + botão CTA
- **Estilo:** Center-aligned, padding generoso

#### 1.5 How It Works (Timeline)
- **Grid:** 4 colunas responsiva
- **Cada step:**
  - Número em círculo gold (50x50px)
  - H3 título
  - Parágrafo descrição
- **Linha decorativa:** Gradiente gold passando sobre os números
- **Animação:** Fade-in com delay escalonado

#### 1.6 Formulário Principal (CRÍTICO)

**Grid Layout:** 2+ colunas responsivo

**Campos:**
```
Linha 1: Nome Completo | CPF
Linha 2: Email | WhatsApp
Linha 3: Cidade | Estado (select com todos 27 estados)
Linha 4: Tipo de Conta (select) - 4 opções
Linha 5: Tipo de Documento (select) - 4 opções
Linha 6: Mensagem (textarea, full-width)
Linha 7: Upload Area (drag-drop, full-width)
Linha 8: Lista de arquivos (dinâmica, full-width)
Linha 9: Checkbox de privacidade (full-width)
Linha 10: Botão Submit (full-width)
```

**Validações:**
- Todos os campos * são obrigatórios
- CPF: validar formato
- Email: validar formato
- Arquivo: máximo 5MB, apenas PDF/JPG/PNG
- Checkbox: deve estar marcado

**Upload Area:**
- Dashed border gold
- Ícone 📄 grande
- Texto: "Clique ou arraste para enviar"
- Aceita: PDF, JPG, PNG
- Máximo: 5MB por arquivo
- Drag-over: background mais claro
- Ao selecionar: inicia OCR automaticamente

**Comportamento OCR:**
1. Cliente faz upload
2. Tesseract.js inicia ("🔄 Processando OCR...")
3. Extrai texto da imagem/PDF
4. Envia para `/api/analyze`
5. Backend retorna resultado com cobranças detectadas
6. Modal aparece mostrando resultado em tabela
7. Email é enviado para cliente + você

**Modal de Resultado:**
- Background escuro com overlay
- Card branco/dark
- H2: "📊 Resultado da Análise"
- Se encontrou cobranças: Tabela com:
  - Coluna 1: Categoria (gold)
  - Coluna 2: Ocorrências (número)
  - Coluna 3: Confiança (barra visual + %)
- Se não encontrou: Mensagem "✓ Nenhuma cobrança suspeita..."
- Aviso legal em rodapé
- Botão fechar

#### 1.7 OCR Results Section
- **Mockup visual** mostrando 3 cards com exemplos de resultado
- **Cards:**
  - Seguro/Assistência: 2 ocorrências
  - Tarifas/Cestas: 3 ocorrências
  - Recorrentes: 1 ocorrência
- **Disclaimer amarelo:** "A localização de uma cobrança não significa que seja indevida..."

#### 1.8 Recovery Section
- **4 cards:** Cancelamento, Restituição Simples, Restituição em Dobro, Dano Moral
- **Grid:** responsivo
- **Disclaimer:** "A restituição em dobro não é automática..."

#### 1.9 Individual vs Coletiva
- **2 colunas:** Análise Individual | Estratégia Coletiva
- **Cada:** H3 + lista com bullets

#### 1.10 Documentation
- **Checklist:** 6 itens com icons e checkmarks verdes

#### 1.11 Team/Credentials
- **Background:** Navy-dark
- **H2:** "Análise conduzida por equipe jurídica"
- **Grid:** 6 items (Online, Nacional, Documental, WhatsApp, Linguagem Clara, Individual)
- **Cada item:** Icon + H4 + P

#### 1.12 FAQ
- **Accordeon:** 9 items
- **Toggle:** ▼ que rotaciona 180°
- **Max-height animation:** 0 → 500px

#### 1.13 Final CTA
- **Background:** Gold gradient
- **Texto:** Navy color (inverso)
- **Botões:** Navy background com gold text
- **Disclaimer:** Navy escuro

#### 1.14 Footer
- **Grid:** 3 colunas responsivo
- **Coluna 1:** Nome + descrição
- **Coluna 2:** Contato (WhatsApp + Email com links)
- **Coluna 3:** Links úteis
- **Bottom:** Border-top + copyright
- **Disclaimer legal:** Background subtle + border-left gold

#### 1.15 Floating WhatsApp Button
- **Position:** Fixed, bottom-right
- **Size:** 60px circular
- **Color:** WhatsApp green (#25D366)
- **Icon:** 💬
- **Hover:** Scale 1.1 + translateY(-4px)
- **Link:** https://wa.me/5543991032372?text=...

---

### 2. Thank You Page (obrigado.html)

**Propósito:** Confirmação após envio bem-sucedido

**Layout:**
- **Container:** Centrado, max-width 600px
- **Checkmark:** ✓ grande (4rem, green)
- **H1:** "Recebemos suas informações!" (gold)
- **Parágrafo:** Confirmação e próximos passos
- **Lista numerada:** 4 próximos passos
- **Botões:** WhatsApp + voltar ao home

---

## Design Tokens

### Colors
```javascript
const colors = {
  navy: '#2C3E50',
  navyDark: '#1A2634',
  gold: '#B8956A',
  goldLight: '#D4AF9E',
  bgDark: '#0F1419',
  bgCard: '#1A2634',
  textLight: '#E8E8E8',
  textMuted: '#B0B0B0',
  borderSubtle: 'rgba(184, 149, 106, 0.15)',
  success: '#22C55E',
  alert: '#F59E0B',
};
```

### Spacing Scale
- xs: 0.5rem (8px)
- sm: 1rem (16px)
- md: 1.5rem (24px)
- lg: 2rem (32px)
- xl: 3rem (48px)
- 2xl: 4rem (64px)

### Typography
```javascript
const typography = {
  h1: { size: '2.8rem', weight: 700, lineHeight: 1.2 },
  h2: { size: '2rem', weight: 600, lineHeight: 1.3 },
  h3: { size: '1.1rem', weight: 600, lineHeight: 1.4 },
  p: { size: '1rem', weight: 400, lineHeight: 1.6 },
  small: { size: '0.9rem', weight: 400, lineHeight: 1.5 },
};

fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica Neue, sans-serif';
```

### Borders & Shadows
```javascript
borderRadius: {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
};

shadows: {
  sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
  md: '0 8px 16px rgba(184, 149, 106, 0.2)',
  lg: '0 12px 24px rgba(184, 149, 106, 0.3)',
};
```

### Animations
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

animation-duration: 0.6s;
animation-timing-function: ease;
transition: all 0.3s ease;
```

---

## Interactions & Behavior

### 1. Scroll Reveal Animation
- Todos os elementos com `.fade-in`
- Aparecem quando entram no viewport
- IntersectionObserver com threshold 0.1
- Staggered delays (0s, 0.1s, 0.2s, etc)

### 2. Upload & OCR
1. Cliente clica ou arrasta arquivo
2. Validar: tamanho < 5MB, formato válido
3. Mostrar loader: "🔄 Processando OCR..."
4. Tesseract.js extrai texto (30-60 segundos)
5. Enviar POST `/api/analyze` com:
   ```json
   {
     "extractedText": "...",
     "clientName": "...",
     "clientEmail": "...",
     "clientCPF": "...",
     "clientPhone": "...",
     "clientCity": "...",
     "clientState": "...",
     "bankAccount": "...",
     "documentType": "..."
   }
   ```
6. Backend retorna:
   ```json
   {
     "success": true,
     "detectedCharges": [
       {
         "category": "Seguros",
         "instances": 2,
         "confidence": 85,
         "examples": ["seguro", "proteção"]
       }
     ],
     "message": "Análise realizada..."
   }
   ```
7. Mostrar modal com resultado (tabela)
8. Enviar email para cliente + admin

### 3. Form Validation
- Antes de submit, validar:
  - Nome: não vazio
  - CPF: formato XX.XXX.XXX-XX
  - Email: válido
  - WhatsApp: com dígitos
  - Cidade/Estado: preenchidos
  - Bank account: selecionado
  - Document type: selecionado
  - Checkbox: marcado
  - Arquivo: selecionado e OCR processado

### 4. Accordion FAQ
- Clique em `.faq-question` → toggle classe `.open`
- `.open` → `.faq-answer` max-height: 0 → 500px
- `.faq-toggle` rotate: 0 → 180deg
- Transição: 0.3s ease

### 5. Hover States
- Botões: transform translateY(-3px), box-shadow aumenta
- Cards: border-color → gold, transform translateY(-4px)
- Links: color → gold
- Duration: 0.3s

### 6. Mobile Responsiveness
- Header nav desaparece (display: none)
- Form buttons empilham vertically
- Hero section stacked (1 coluna)
- Timeline sem linha decorativa
- FAQ accordion funciona igual

---

## State Management (Frontend)

```javascript
// Form data
{
  name: string,
  cpf: string,
  email: string,
  whatsapp: string,
  city: string,
  state: string,
  bankAccount: string,
  documentType: string,
  message: string,
  agreeToTerms: boolean,
}

// Upload state
{
  uploadedFiles: File[],
  extractedText: string,
  isProcessing: boolean,
}

// OCR result state
{
  detectedCharges: DetectedCharge[],
  showResultModal: boolean,
  analysisInProgress: boolean,
}

type DetectedCharge = {
  category: string,
  instances: number,
  confidence: number,
  examples: string[],
}
```

---

## Backend API

### Endpoint: POST /api/analyze

**Request Body:**
```typescript
{
  extractedText: string;        // Texto extraído pelo OCR
  clientName: string;
  clientEmail: string;
  clientCPF: string;
  clientPhone: string;
  clientCity: string;
  clientState: string;
  bankAccount: string;          // 'corrente' | 'cartao' | 'ambos' | 'nao-sei'
  documentType: string;         // 'fatura' | 'extrato' | 'print' | 'outro'
}
```

**Response Success (200):**
```json
{
  "success": true,
  "detectedCharges": [
    {
      "category": "Seguros",
      "instances": 2,
      "confidence": 85,
      "examples": ["seguro cartão protegido", "seguro prestamista"]
    }
  ],
  "message": "Análise realizada com sucesso. Confira seu email."
}
```

**Response Error (400/500):**
```json
{
  "error": "Mensagem de erro descritiva"
}
```

**Backend Logic:**
1. Validar campos obrigatórios
2. Chamar `analyzeText(extractedText)` para buscar keywords
3. Salvar em `analyses` tabela no Supabase
4. Enviar email para cliente (resultado)
5. Enviar email para admin (com dados do cliente + resultado)
6. Retornar `detectedCharges` + mensagem de sucesso

**Keywords para detectar:**
```javascript
const chargeKeywords = {
  'Seguros': ['seguro', 'proteção vida', 'prestamista', 'cartão protegido'],
  'Cesta de Serviços': ['cesta', 'pacote', 'serviços bancários'],
  'Tarifas': ['tarifa', 'taxa', 'manutenção'],
  'Proteção Financeira': ['proteção', 'financeira'],
  'Assistência': ['assistência', 'auxílio', 'suporte'],
  'Bolsa Protegida': ['bolsa protegida', 'bolsa'],
  'Anuidade': ['anuidade', 'anual'],
  'Encargos': ['encargo', 'juros', 'multa'],
  'Serviços de Terceiros': ['terceiros', 'serviço de terceiros'],
  'Recorrente': ['recorrente', 'periódico', 'mensal'],
};
```

---

## Assets

- `logo-nhb-transparent.png` — Logo do escritório (100px height)
- Ícones emoji em strings (não PNG)
- Nenhum design gráfico customizado

---

## Environment Variables Necessárias

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJxxx...
SENDGRID_API_KEY=SG.xxx... (ou Gmail)
GMAIL_USER=seu@email.com (se usar Gmail)
GMAIL_APP_PASSWORD=xxxx (App password do Gmail)
ADMIN_EMAIL=contato@nhbadvocacia.com
```

---

## Database Schema (Supabase)

```sql
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_cpf VARCHAR(20),
  client_phone VARCHAR(20),
  client_city VARCHAR(100),
  client_state VARCHAR(2),
  bank_account VARCHAR(50),
  document_type VARCHAR(50),
  extracted_text TEXT,
  detected_charges JSONB,
  confidence_score NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_client_email ON analyses(client_email);
CREATE INDEX idx_created_at ON analyses(created_at DESC);
```

---

## Files in This Handoff

- `index.html` — Landing page principal (68KB, HTML puro com Tesseract.js)
- `obrigado.html` — Página de obrigado
- `logo-nhb-transparent.png` — Logo
- `api/analyze.ts` — Backend TypeScript para Vercel
- `package.json` — Dependências Node.js
- `vercel.json` — Config Vercel
- `SETUP_OCR.md` — Instruções de setup completo
- `PUBLICACAO_HOSTINGER.md` — Instruções para publicar na Hostinger
- `OCR_DOCUMENTACAO.md` — Documentação técnica

---

## Implementation Notes

1. **Tesseract.js é pesado:** ~14MB, carrega apenas na primeira vez
2. **OCR pode ser lento:** 30-60 segundos em PDFs grandes — isso é normal
3. **CORS:** Se rodar em localhost, pode ter problemas com CORS no Supabase — use Vercel
4. **Email:** SendGrid é mais confiável; Gmail funciona mas pode ter limite de 100/dia
5. **Supabase Rate Limit:** Pode precisar aumentar se tiver muitos usuários
6. **Segurança:** Implemente rate limiting na API para evitar abuso

---

## Deploy Checklist

- [ ] Criar conta Supabase + configurar tabela
- [ ] Criar conta Vercel + conectar GitHub
- [ ] Criar SendGrid/Gmail account
- [ ] Configurar env vars no Vercel
- [ ] Deploy código
- [ ] Testar upload → OCR → email completo
- [ ] Conectar domínio `itau.nhbadvocacia.com`
- [ ] Testar em mobile

---

**Status:** ✅ Pronto para implementação no Claude Code
