# ✅ Checklist de Deploy - OCR Landing Page

## 📋 Antes de começar
- [ ] Ter acesso ao computador com Windows
- [ ] npm instalado (`npm --version`)
- [ ] Git instalado (opcional)
- [ ] Conta Gmail/Google ativa

---

## 🔑 Passo 1: Criar Contas (20 min)

### Supabase (Banco de Dados)
- [ ] Acessar https://supabase.co
- [ ] Clique "New Project"
- [ ] Preencher dados do projeto
- [ ] Aguardar criação (2-3 min)
- [ ] Vá para SQL Editor
- [ ] Executar script SQL (arquivo SETUP.md)
- [ ] Copiar `SUPABASE_URL` (Settings → API)
- [ ] Copiar `SUPABASE_KEY` (Settings → API → anon)

### SendGrid (Email)
- [ ] Acessar https://sendgrid.com
- [ ] Clique "Sign Up"
- [ ] Preencher dados
- [ ] Verificar email
- [ ] Vá para Settings → API Keys
- [ ] Criar nova API Key
- [ ] Copiar `SENDGRID_API_KEY`

### Vercel (Deploy)
- [ ] Acessar https://vercel.com
- [ ] Clique "Sign Up"
- [ ] Conectar com GitHub/Google
- [ ] Confirmar email
- [ ] Dashboard aberto

---

## 📦 Passo 2: Preparar Projeto Local (5 min)

```bash
# Terminal/PowerShell
cd C:\Users\nelbr\.claude\APP\LP\ITAU\design_handoff_ocr_landing

# Instalar Vercel CLI (primeira vez)
npm install -g vercel

# Verificar instalação
vercel --version
```

- [ ] Vercel CLI instalado
- [ ] Terminal aberto na pasta do projeto
- [ ] Todos os arquivos presentes:
  - [ ] landing.html
  - [ ] api/analyze.js
  - [ ] package.json
  - [ ] vercel.json
  - [ ] .env.example

---

## 🚀 Passo 3: Deploy no Vercel (10 min)

```bash
# No terminal, na pasta do projeto
vercel --prod
```

Responder às perguntas:
- [ ] "Set up and deploy" → **Y**
- [ ] "Link to existing project?" → **N**
- [ ] "Project name" → `nhb-ocr-landing`
- [ ] "Which directory" → **.(current)**
- [ ] "Override settings" → **N**
- [ ] Aguardar deploy (2-3 min)

Copiar do output:
- [ ] `VERCEL_URL` (ex: https://nhb-ocr-landing.vercel.app)

---

## 🔐 Passo 4: Variáveis de Ambiente (10 min)

**No dashboard do Vercel:**
1. [ ] Abrir projeto `nhb-ocr-landing`
2. [ ] Vá para **Settings**
3. [ ] Clique em **Environment Variables**
4. [ ] Adicionar cada variável:

```
Nome: SUPABASE_URL
Valor: https://seu-projeto.supabase.co

Nome: SUPABASE_KEY
Valor: eyJxxx...

Nome: SENDGRID_API_KEY
Valor: SG.xxx...

Nome: ADMIN_EMAIL
Valor: contato@nhbadvocacia.com
```

- [ ] Salvar cada variável
- [ ] Após adicionar todas, ir para **Deployments**
- [ ] Clique no deployment mais recente
- [ ] Clique **Redeploy** (para usar as novas variáveis)

---

## ✅ Passo 5: Testar em Produção (10 min)

1. [ ] Abrir `https://nhb-ocr-landing.vercel.app` em navegador
2. [ ] Página carrega corretamente?
3. [ ] Design está bom? (cores, fontes, layout)
4. [ ] Botões funcionam?
5. [ ] Formulário:
   - [ ] Preencher campos
   - [ ] Upload teste de arquivo
   - [ ] Clique em "Analisar"
6. [ ] Recebeu email com resultado?

Se tudo OK → ✅ **Deploy bem-sucedido!**

Se houver erros:
1. [ ] Verificar logs: Vercel → Deployments → Logs
2. [ ] Verificar variáveis: Settings → Environment Variables
3. [ ] Verificar Supabase: Dashboard → SQL Editor (tabela existe?)
4. [ ] Testar localmente: `vercel dev` (opcional)

---

## 🌐 Passo 6: Domínio Personalizado (OPCIONAL - 20 min)

Se quiser usar `itau.nhbadvocacia.com`:

1. [ ] Vercel → Project Settings → Domains
2. [ ] Clique "Add Domain"
3. [ ] Digite `itau.nhbadvocacia.com`
4. [ ] Copiar DNS records
5. [ ] Registrador de domínio (GoDaddy, Registrar, etc):
   - [ ] Zone File / DNS Settings
   - [ ] Adicionar os records do Vercel
   - [ ] Aguardar propagação (5-24h)
6. [ ] Verificar: Vercel deve mostrar "Valid Configuration"

---

## 📊 Passo 7: Monitorar Análises (Contínuo)

**Ver leads no Supabase:**
1. [ ] Supabase Dashboard
2. [ ] Clique em **Table Editor**
3. [ ] Clique em `analyses`
4. [ ] Ver todos os registros recebidos

**Verificar logs no Vercel:**
1. [ ] Vercel Dashboard
2. [ ] Project → **Deployments**
3. [ ] Clique em deployment
4. [ ] Aba **Logs**
5. [ ] Ver erros/avisos

---

## 🎯 Resultado Final

- [ ] Landing page online
- [ ] OCR funcionando
- [ ] Email automático
- [ ] Banco de dados salvando
- [ ] Leads chegando pelo formulário

---

## 📞 Se der problema

| Problema | Verifique |
|----------|-----------|
| Email não chega | SENDGRID_API_KEY em Vercel |
| OCR não funciona | Conexão internet, recarga página |
| Dados não salvam | SUPABASE_URL/KEY corretos, tabela criada |
| Página em branco | Logs Vercel, arquivo landing.html |
| Erro 405 | vercel.json routes está correto |

---

## 🎉 Próximas Ações

- [ ] Compartilhar URL com clientes
- [ ] Testar com documentos reais
- [ ] Monitorar emails/leads
- [ ] Adicionar GA (Google Analytics)
- [ ] Customizar templates de email
- [ ] Setup rate limiting (se necessário)

---

## 📝 Notas

- Primeira análise pode demorar 30-60 segundos (Tesseract.js)
- SendGrid gratuito = 100 emails/dia (suficiente para iniciar)
- Supabase gratuito = 500MB storage (suficiente para 50k+ análises)
- Vercel gratuito = 100 deployments/mês (suficiente)

---

**Estimado: ~1 hora para setup completo** ⏱️

Criado: 2024-06-04
