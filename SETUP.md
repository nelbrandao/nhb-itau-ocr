# 🚀 Setup Completo - OCR Landing Page

## 📋 O que foi criado

✅ **landing.html** — Frontend completo com OCR automático (Tesseract.js)
✅ **api/analyze.js** — Backend Node.js/Vercel para processar análises
✅ **package.json** — Dependências do projeto
✅ **vercel.json** — Configuração de deploy automático
✅ **Este guia** — Instruções passo a passo

---

## 🔧 Pré-requisitos

1. **Conta no Vercel** (gratuita) — https://vercel.com
2. **Conta no Supabase** (gratuita) — https://supabase.co
3. **Email para notificações:**
   - SendGrid (recomendado) — https://sendgrid.com
   - OU Gmail com App Password
4. **Git instalado** (opcional, mas recomendado)

---

## 📝 Passo 1: Configurar Supabase (Banco de Dados)

### 1.1 Criar conta e novo projeto
1. Acesse https://supabase.co
2. Clique em "New Project"
3. Preencha:
   - Project Name: `nhb-ocr-landing`
   - Database Password: `Senha_forte_aqui`
   - Region: `South America (São Paulo)` se disponível

### 1.2 Criar tabela `analyses`
1. Na dashboard, vá para **SQL Editor**
2. Copie e execute este SQL:

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
   - **Project API Key** (anon) → `SUPABASE_KEY`

---

## 📧 Passo 2: Configurar Email

### Opção A: SendGrid (Recomendado)

1. Acesse https://sendgrid.com
2. Crie conta gratuita
3. Vá para **Settings → API Keys**
4. Crie uma nova API Key
5. Copie o valor → `SENDGRID_API_KEY`

### Opção B: Gmail

1. Ative **2-Factor Authentication** na sua conta Google
2. Vá para **Google Account → Security**
3. Procure por **App Passwords**
4. Crie uma password para "Mail" e "Windows"
5. Copie a senha → `GMAIL_APP_PASSWORD`
6. Seu email → `GMAIL_USER`

---

## 🚀 Passo 3: Deploy no Vercel

### 3.1 Preparar o projeto
```bash
cd C:\Users\nelbr\.claude\APP\LP\ITAU\design_handoff_ocr_landing

# Instalar Vercel CLI (primeira vez)
npm install -g vercel

# Deploy
vercel --prod
```

### 3.2 Seguir o wizard
1. Quando perguntado, selecione seu conta
2. **Project Name:** `nhb-ocr-landing`
3. **Framework:** Selecione "Other"
4. Aceite os defaults

### 3.3 Configurar variáveis de ambiente
1. Acesse o painel do Vercel
2. Vá para **Settings → Environment Variables**
3. Adicione cada variável:

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJxxx...
SENDGRID_API_KEY=SG.xxx...
GMAIL_USER=seu@email.com (se usar Gmail)
GMAIL_APP_PASSWORD=xxxx (se usar Gmail)
ADMIN_EMAIL=contato@nhbadvocacia.com
```

4. Clique "Deploy" novamente para redeployr com as variáveis

---

## 🔗 Passo 4: Conectar Domínio Personalizado

1. Compre um domínio (Registrar.com, GoDaddy, Hostinger, etc)
2. No Vercel:
   - **Settings → Domains**
   - Adicione seu domínio
   - Siga as instruções para atualizar DNS

Exemplo:
```
itau.nhbadvocacia.com → aponta para → nhb-ocr-landing.vercel.app
```

---

## ✅ Testar a Landing Page

### 1. Teste local (opcional)
```bash
vercel dev
# Acesse http://localhost:3000
```

### 2. Teste na produção
1. Acesse sua URL do Vercel: `https://nhb-ocr-landing.vercel.app`
2. Preencha o formulário com dados de teste
3. Faça upload de uma imagem/PDF
4. Clique em "Analisar"
5. Verifique se recebeu email

---

## 📊 Monitorar Análises

### Ver dados no Supabase
1. Acesse dashboard do Supabase
2. Vá para **Table Editor**
3. Clique em `analyses`
4. Veja todos os leads recebidos

### Logs de erro no Vercel
1. Acesse dashboard do Vercel
2. Vá para **Deployments → Logs**
3. Verifique logs de erro (se houver)

---

## 🛠️ Troubleshooting

### Problema: "Email não foi enviado"
**Solução:**
- Verifique `SENDGRID_API_KEY` está correto
- Se usar Gmail, verifique que habilitou App Passwords
- Verifique `ADMIN_EMAIL` é válido

### Problema: "OCR não funciona"
**Solução:**
- Tesseract.js carrega via CDN — verifique conexão internet
- Primeira análise pode demorar 30-60 segundos (normal)
- Tente um PDF ou imagem de menor resolução

### Problema: "Dados não salvam no banco"
**Solução:**
- Verifique `SUPABASE_URL` e `SUPABASE_KEY`
- Confirme que a tabela `analyses` foi criada
- Verifique permissões (Row Level Security) — desabilite se necessário:
  - **Settings → Auth → Policies** → desabilite RLS

### Problema: "CORS error"
**Solução:**
- Isso raramente acontece em Vercel
- Se acontecer, adicione headers CORS manualmente em vercel.json

---

## 📈 Próximos Passos

1. **Customizar email:** Editar template em `api/analyze.js`
2. **Adicionar mais keywords:** Editar `chargeKeywords` no `api/analyze.js`
3. **Analytics:** Integrar Google Analytics no `landing.html`
4. **Rate limiting:** Proteger API contra spam (solicitar no Vercel)
5. **WhatsApp integração:** Usar WhatsApp Business API para automação

---

## 💡 Dicas Importantes

- **Tesseract.js é pesado:** ~14MB, carrega apenas na primeira vez (cache)
- **OCR pode ser lento:** Até 60 segundos em PDFs grandes — normal
- **Emails:** SendGrid tem limite de 100/dia na tier gratuita; para produção, upgrade
- **Supabase:** Tier gratuita tem limitações; se crescer, considere upgrade
- **Segurança:** Implementar rate limiting quando tiver muito tráfego

---

## 📞 Suporte

Qualquer dúvida:
- WhatsApp: (43) 99103-2372
- Email: contato@nhbadvocacia.com
- GitHub Issues (se usar repo privado)

---

**Status:** ✅ Pronto para produção

Criado em: 2024-06-04
