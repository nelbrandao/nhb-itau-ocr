# 🚀 Setup OCR Automático - Vercel + Supabase

## 1️⃣ Configurar Supabase

### 1.1 Criar Conta
- Acesse [supabase.com](https://supabase.com)
- Faça login com GitHub ou email
- Crie um novo projeto

### 1.2 Criar Tabela `analyses`

No SQL Editor do Supabase, execute:

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

-- Criar índices para busca rápida
CREATE INDEX idx_client_email ON analyses(client_email);
CREATE INDEX idx_created_at ON analyses(created_at DESC);
```

### 1.3 Obter Credenciais
- Vá para **Settings** → **API**
- Copie:
  - **Project URL** = `SUPABASE_URL`
  - **anon public** (no campo `Key`) = `SUPABASE_KEY`

---

## 2️⃣ Configurar Email (SendGrid ou Gmail)

### Opção A: SendGrid (Recomendado)

1. Acesse [sendgrid.com](https://sendgrid.com)
2. Crie uma conta gratuita
3. Vá para **API Keys**
4. Crie nova API Key: `SENDGRID_API_KEY`
5. Guarde o valor

### Opção B: Gmail

1. Ative 2FA na sua conta Google
2. Gere uma [App Password](https://myaccount.google.com/apppasswords)
3. Guarde:
   - `GMAIL_USER` = seu email
   - `GMAIL_APP_PASSWORD` = a senha gerada

---

## 3️⃣ Publicar no Vercel

### 3.1 Preparar Repositório GitHub

```bash
# No terminal, na pasta do projeto:
git init
git add .
git commit -m "Initial commit: OCR landing page"
git branch -M main
git remote add origin https://github.com/SEU_USER/nhb-itau.git
git push -u origin main
```

### 3.2 Conectar Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique **Add New** → **Project**
4. Selecione seu repo `nhb-itau`
5. Configure:
   - **Framework Preset:** Other
   - **Build Command:** `npm install`
   - **Output Directory:** deixe em branco
   - **Environment Variables:** (ver seção abaixo)

### 3.3 Adicionar Variáveis de Ambiente

No painel do Vercel, vá para **Settings** → **Environment Variables** e adicione:

```
SUPABASE_URL = (seu valor do Supabase)
SUPABASE_KEY = (sua chave do Supabase)
SENDGRID_API_KEY = (sua chave SendGrid) OU
GMAIL_USER = (seu email) + GMAIL_APP_PASSWORD = (seu app password)
ADMIN_EMAIL = contato@nhbadvocacia.com (seu email para receber análises)
```

### 3.4 Deploy

Clique **Deploy** e aguarde. Vercel criará automaticamente:
- URL pública (ex: `nhb-itau.vercel.app`)
- API em `https://nhb-itau.vercel.app/api/analyze`

---

## 4️⃣ Conectar ao Seu Domínio

### Via Vercel

1. No painel do projeto, vá para **Settings** → **Domains**
2. Adicione `itau.nhbadvocacia.com`
3. Vercel mostrará registros DNS para adicionar
4. Na Hostinger/seu registrador, adicione os registros CNAME/A

### Via Hostinger

1. No painel da Hostinger, vá para **Domains** → **DNS Records**
2. Crie CNAME:
   - **Name:** `itau`
   - **Value:** seu domínio Vercel

---

## 5️⃣ Testar Fluxo Completo

1. Acesse sua landing page: `https://itau.nhbadvocacia.com`
2. Envie uma fatura/extrato
3. Aguarde o OCR processar (30-60 segundos)
4. Veja os resultados na página
5. Verifique email para relatório completo

---

## 📋 Checklist de Setup

- [ ] Conta Supabase criada
- [ ] Tabela `analyses` criada
- [ ] Credenciais Supabase obtidas
- [ ] Email configurado (SendGrid ou Gmail)
- [ ] Repositório GitHub criado
- [ ] Projeto conectado ao Vercel
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Deploy realizado com sucesso
- [ ] Domínio conectado
- [ ] Fluxo testado (upload → OCR → email)

---

## 🆘 Troubleshooting

### ❌ API retorna 500
- Verifique variáveis de ambiente no Vercel
- Veja logs em **Vercel Dashboard** → **Functions**

### ❌ Email não chega
- Confirme chave SendGrid está ativa
- Ou confirm Gmail 2FA + App Password estão corretos

### ❌ OCR muito lento
- Normal para PDFs grandes (até 2 minutos)
- Considere comprimir imagens antes

### ❌ Supabase conexão recusada
- Verifique IP: Supabase pode estar bloqueando
- Vá para **Settings** → **Network** → aumente rate limit

---

## 📚 Documentação Útil

- [Tesseract.js Docs](https://github.com/naptha/tesseract.js)
- [Supabase API](https://supabase.com/docs/reference/javascript)
- [Vercel Functions](https://vercel.com/docs/serverless-functions/overview)
- [SendGrid API](https://sendgrid.com/docs/API_Reference/api_v3.html)

---

**Status:** ✅ Pronto para configuração
