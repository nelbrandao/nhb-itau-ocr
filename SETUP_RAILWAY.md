# 🚀 Setup Completo - OCR Landing Page + Railway

## 📋 O que foi criado

✅ **landing.html** — Frontend com OCR automático (Tesseract.js)  
✅ **server.js** — Express server para Railway  
✅ **package.json** — Dependências Node.js  
✅ **railway.json** — Configuração Railway  
✅ **Este guia** — Instruções passo a passo  

---

## 🔧 Pré-requisitos

1. **Conta no Railway** (gratuita) — https://railway.app
2. **Conta no GitHub** (para conectar repo)
3. **Conta no Supabase** (gratuita) — https://supabase.co
4. **Email para notificações:**
   - SendGrid (recomendado) — https://sendgrid.com
   - OU Gmail com App Password

---

## 📝 Passo 1: Configurar Supabase (Banco de Dados)

### 1.1 Criar projeto
1. Acesse https://supabase.co
2. Clique em "New Project"
3. Preencha:
   - Project Name: `nhb-ocr-landing`
   - Database Password: `Senha_forte_aqui`
   - Region: `South America (São Paulo)`

### 1.2 Criar tabela
1. Vá para **SQL Editor**
2. Execute este SQL:

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

### 1.3 Copiar credenciais
1. Vá para **Settings → API**
2. Copie:
   - **Project URL** → `SUPABASE_URL`
   - **Project API Key (anon)** → `SUPABASE_KEY`

---

## 📧 Passo 2: Configurar Email

### Opção A: SendGrid (Recomendado)
1. Acesse https://sendgrid.com
2. Crie conta
3. **Settings → API Keys** → Nova API Key
4. Copie → `SENDGRID_API_KEY`

### Opção B: Gmail
1. Google Account → Security → 2-Factor Auth
2. Procure **App Passwords**
3. Crie password para "Mail"
4. Copie → `GMAIL_APP_PASSWORD`
5. Seu email → `GMAIL_USER`

---

## 🔗 Passo 3: Preparar Git (GitHub)

### 3.1 Criar repositório GitHub
1. Vá para https://github.com/new
2. Nome: `nhb-ocr-landing`
3. Clique "Create repository"

### 3.2 Push do projeto local
```bash
cd C:\Users\nelbr\.claude\APP\LP\ITAU\design_handoff_ocr_landing

# Inicializar git
git init
git add .
git commit -m "Initial commit: OCR landing page"

# Adicionar remoto
git remote add origin https://github.com/SEU_USER/nhb-ocr-landing.git

# Push
git branch -M main
git push -u origin main
```

---

## 🚂 Passo 4: Deploy no Railway

### 4.1 Conectar Railway
1. Acesse https://railway.app
2. Clique "New Project"
3. Clique "Deploy from GitHub repo"
4. Selecione `nhb-ocr-landing`
5. Confirme

### 4.2 Aguardar deploy automático
Railway vai:
- Detectar Node.js
- Instalar dependências (npm install)
- Rodar `npm start`
- Gerar URL automática

Isso leva ~3-5 minutos.

---

## 🔐 Passo 5: Configurar Variáveis de Ambiente

**No painel do Railway:**
1. Abrir projeto `nhb-ocr-landing`
2. Clique em **Variables** (abaixo do deploy)
3. Adicione cada variável:

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=eyJxxx...
SENDGRID_API_KEY=SG.xxx...
ADMIN_EMAIL=contato@nhbadvocacia.com
```

Se usar Gmail:
```
GMAIL_USER=seu@email.com
GMAIL_APP_PASSWORD=xxxx
```

### 5.2 Redeploy após adicionar variáveis
1. Clique em **Deployments**
2. Clique no deploy mais recente
3. Clique **Redeploy**

---

## ✅ Passo 6: Testar em Produção

1. No painel do Railway, copie a URL (ex: `https://nhb-ocr-landing-production.up.railway.app`)
2. Abra em novo navegador
3. Preencha o formulário
4. Faça upload de teste
5. Clique "Analisar"
6. Verifique se recebeu email

Se tudo OK → ✅ **Live!**

---

## 🌐 Passo 7: Conectar Domínio Personalizado (OPCIONAL)

1. Railway → **Settings → Custom Domain**
2. Digite seu domínio (ex: `itau.nhbadvocacia.com`)
3. Copiar DNS records
4. Registrador de domínio (GoDaddy, Registrar, etc):
   - Zone File / DNS Settings
   - Adicionar records
   - Aguardar propagação (5-24h)

---

## 📊 Monitorar Análises

### Ver dados
1. Supabase → **Table Editor** → `analyses`
2. Ver todos os leads

### Logs Railway
1. Railway Dashboard → **Logs**
2. Ver erros/mensagens

---

## 🛠️ Troubleshooting

| Problema | Solução |
|----------|---------|
| Deploy falha | Verificar Logs (Railway) |
| Email não chega | Verificar SENDGRID_API_KEY / GMAIL_PASSWORD |
| OCR não funciona | Recarregar página, conexão internet |
| Dados não salvam | Verificar SUPABASE_URL/KEY, criar tabela |

---

## 💰 Custos

**Totalmente GRÁTIS:**
- Railway: Grátis (5$/mês crédito, suficiente)
- Supabase: Grátis (500MB)
- SendGrid: Grátis (100 emails/dia)
- GitHub: Grátis

---

## 📈 Fazer alterações depois

Para mudar o código:

```bash
# Fazer alterações localmente
# Editar landing.html ou server.js

# Commit e push
git add .
git commit -m "Descrever mudança"
git push origin main
```

Railway vai **redeploy automaticamente** quando detectar mudanças no GitHub! ✨

---

## 🎉 Próximos Passos

- [ ] Compartilhar URL com clientes
- [ ] Testar com documentos reais
- [ ] Monitorar emails/leads
- [ ] Customizar templates de email
- [ ] Adicionar GA (Google Analytics)

---

## 📞 Contato

- WhatsApp: (43) 99103-2372
- Email: contato@nhbadvocacia.com

---

**Estimado: 30-45 min para setup completo** ⏱️

Status: ✅ Pronto para Railway
