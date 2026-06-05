# 🎯 Projeto OCR Landing Page - Análise de Cobranças Bancárias

## 📦 Arquivos Criados

```
design_handoff_ocr_landing/
├── landing.html              ← Frontend COMPLETO (pronto para usar)
├── api/
│   └── analyze.js           ← Backend Vercel serverless
├── package.json             ← Dependências Node.js
├── vercel.json              ← Configuração de deploy
├── .env.example             ← Variáveis de ambiente (template)
├── SETUP.md                 ← Guia passo a passo de setup
├── README.md                ← Handoff design original
└── README_PROJETO.md        ← Este arquivo
```

---

## 🚀 Quick Start (5 minutos)

### 1. Preparar credenciais

```bash
# Crie contas (gratuitas):
# - Supabase: https://supabase.co (banco de dados)
# - SendGrid: https://sendgrid.com (emails)
# - Vercel: https://vercel.com (deploy)
```

### 2. Deploy
```bash
cd C:\Users\nelbr\.claude\APP\LP\ITAU\design_handoff_ocr_landing
npm install -g vercel
vercel --prod
```

### 3. Configurar variáveis no Vercel
- Acesse painel do Vercel
- Settings → Environment Variables
- Adicione `SUPABASE_URL`, `SUPABASE_KEY`, `SENDGRID_API_KEY`, `ADMIN_EMAIL`
- Redeploy

### 4. Testar
- Acesse sua URL
- Preencha formulário
- Faça upload de um documento
- Clique "Analisar"

**Pronto! 🎉**

---

## 📋 O que cada arquivo faz

### `landing.html`
- **Frontend completo** com todos os components do design
- OCR automático com Tesseract.js (roda no navegador)
- Upload de arquivos (drag & drop)
- Validação de formulário
- Modal com resultados
- Responsivo (mobile + desktop)
- **Não precisa de build** — é HTML puro

### `api/analyze.js`
- **Backend Node.js** para processar análises
- Recebe texto extraído do OCR
- Busca keywords (seguro, tarifa, cesta, etc)
- Calcula confiança por categoria
- Salva no Supabase
- Envia emails para cliente + admin
- Roda como serverless function no Vercel

### `package.json`
- Dependências:
  - `@supabase/supabase-js` — acesso ao banco de dados
  - `nodemailer` — envio de emails
  - `nodemailer-sendgrid-transport` — integração SendGrid

### `vercel.json`
- Configuração de build e rotas
- Define `/api/analyze` como endpoint
- Define `/` como rota estática (landing.html)
- Variáveis de ambiente

---

## 🔄 Fluxo de Dados

```
1. Cliente acessa landing.html
   ↓
2. Faz upload de documento (PDF/JPG/PNG)
   ↓
3. Tesseract.js (no navegador) extrai texto
   ↓
4. Envia POST para /api/analyze com:
   - Texto extraído
   - Dados do cliente (nome, email, CPF, etc)
   ↓
5. Backend (api/analyze.js):
   - Analisa texto em busca de keywords
   - Calcula confiança por categoria
   - Salva em Supabase
   - Envia emails
   ↓
6. Retorna resultado para modal
   ↓
7. Cliente vê resultado + recebe email
```

---

## 📊 Keywords Detectadas

O sistema busca automaticamente por:

- **Seguros**: seguro, proteção vida, prestamista, cartão protegido
- **Cesta de Serviços**: cesta, pacote, serviços bancários
- **Tarifas**: tarifa, taxa, manutenção, anuidade
- **Proteção Financeira**: proteção, financeira, cobertura
- **Assistência**: assistência, auxílio, suporte
- **Bolsa Protegida**: bolsa protegida, bolsa
- **Encargos**: encargo, juros, multa
- **Serviços de Terceiros**: terceiros, serviço de terceiros
- **Recorrente**: recorrente, periódico, mensal

**Pode editar em:** `api/analyze.js` → `chargeKeywords`

---

## 📧 Email Automático

Dois emails são enviados automaticamente:

### Email do Cliente
- Resultado da análise
- Tabela com categorias detectadas
- Link para contato via WhatsApp

### Email do Admin
- Dados completos do cliente
- Resultado da análise
- Link para dashboard Supabase

---

## 🔐 Segurança

✅ OCR roda **100% no navegador** — nenhuma imagem sai do cliente  
✅ Validação de formulário (email, CPF, telefone)  
✅ Limite de upload: 5MB  
✅ Suporte para CORS  
✅ Dados salvos com hash de segurança (Supabase)

---

## 📱 Responsividade

- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)
- ✅ Menu hamburger em mobile
- ✅ Formulário ajustável

---

## 🎨 Design

- **Cores:** Navy (#2C3E50) + Gold (#B8956A)
- **Tipografia:** DM Sans (Google Fonts)
- **Animações:** Fade-in suaves, hover states
- **Acessibilidade:** Labels claros, contraste adequado

---

## 💰 Custos

**Tier Gratuita (suficiente para iniciar):**
- **Vercel**: Grátis (até 100 deployments/mês)
- **Supabase**: Grátis (até 500MB storage)
- **SendGrid**: Grátis (até 100 emails/dia)
- **Gmail**: Grátis (ilimitado, mas pode ter rate limit)

**Total:** 💯 **Sem custos iniciais**

---

## 🚨 Rate Limiting

Sem proteção contra abuso atualmente. Se tiver muito tráfego, adicionar:

```javascript
// Em api/analyze.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});

app.post('/api/analyze', limiter, handler);
```

---

## 📈 Próximas Melhorias

1. **Dashboard de admin** — visualizar análises em tempo real
2. **Histórico de cliente** — permanecer cliente logado
3. **Agendamento de chamada** — Calendly integrado
4. **Pagamentos** — Stripe para consulta premium
5. **Integração Zapier** — notificações em Slack/Discord
6. **Analytics** — Google Analytics + Mixpanel

---

## 🆘 Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| "Email não enviado" | Credenciais SendGrid/Gmail erradas | Verificar `.env` |
| "OCR não funciona" | Tesseract.js não carregou | Recarregar página, verificar internet |
| "Dados não salvam" | Supabase não conectado | Verificar URL/Key, criar tabela |
| "CORS error" | Header faltando | Verificar `api/analyze.js` headers CORS |

---

## 📞 Contato Rápido

- **WhatsApp**: (43) 99103-2372
- **Email**: contato@nhbadvocacia.com
- **Docs Supabase**: https://supabase.com/docs
- **Docs Vercel**: https://vercel.com/docs

---

## ✨ Features Inclusos

- ✅ OCR automático (Tesseract.js)
- ✅ Análise inteligente de cobranças
- ✅ Validação de formulário
- ✅ Upload drag & drop
- ✅ Modal com resultados
- ✅ Email automático
- ✅ Banco de dados (Supabase)
- ✅ Deploy serverless (Vercel)
- ✅ Design responsivo
- ✅ Acessibilidade
- ✅ CORS habilitado

---

## 🎓 Estrutura Técnica

**Frontend**: HTML5 + CSS3 + Vanilla JavaScript + Tesseract.js  
**Backend**: Node.js + Express (serverless)  
**Database**: PostgreSQL (Supabase)  
**Email**: SendGrid/Gmail  
**Deploy**: Vercel  

---

## 📄 Licença

Propriedade de N.H. Brandão Advogados © 2024

---

**Pronto para usar! 🚀**

Para instruções detalhadas, veja `SETUP.md`
