# 🚀 Como Usar o Claude Code para Implementar

## Visão Geral

Você tem um **pacote completo de design e especificações** para implementar a landing page com OCR automático. Todo o trabalho técnico pode ser feito pelo **Claude Code**.

## Passo 1: Preparar o Repositório GitHub

```bash
# No seu computador:
git clone seu-repo-nhb-itau
cd seu-repo-nhb-itau

# Copie os arquivos do design_handoff_ocr_landing/ para a raiz do projeto
# - index.html
# - obrigado.html
# - logo-nhb-transparent.png
# - api-analyze.ts (renomear para api/analyze.ts)
# - package.json
# - vercel.json

# Commit
git add .
git commit -m "Add OCR landing page design and backend spec"
git push origin main
```

## Passo 2: Abrir no Claude Code

1. Acesse [Claude Code](https://claude.ai/code) (ou use o IDE integrado)
2. Selecione **"Import Project"**
3. Cole a URL do seu repositório GitHub
4. Ou faça upload dos arquivos diretamente

## Passo 3: Dar Instruções para Claude Code

Copie e cole isso no Claude Code:

```
Você tem um pacote de design e especificações para uma landing page com OCR automático.

TAREFA:
1. Implementar a landing page como um projeto Next.js/React production-ready
2. Integrar Tesseract.js para OCR (roda no navegador)
3. Criar backend Node.js/TypeScript para API /api/analyze
4. Integrar com Supabase PostgreSQL
5. Configurar envio de email (SendGrid ou Gmail)
6. Garantir responsividade total (mobile-first)
7. Implementar validações de formulário
8. Fazer tudo estar pronto para deploy na Vercel

REFERÊNCIAS:
- design_handoff_ocr_landing/README.md — especificação completa
- design_handoff_ocr_landing/index.html — design de referência
- design_handoff_ocr_landing/api-analyze.ts — lógica do backend

PRIORIDADES:
1. Funcionalidade OCR + análise automática
2. Responsividade (mobile first)
3. Segurança (validações, rate limit)
4. Performance (lazy load, otimização de imagens)

Comece estruturando o projeto, depois me mostre as próximas etapas.
```

## Passo 4: Seguir as Instruções

Claude Code vai:
1. Estruturar projeto Next.js
2. Recriar componentes React do design
3. Implementar OCR com Tesseract.js
4. Criar API backend
5. Integrar Supabase
6. Configurar email
7. Preparar para deploy Vercel

## Passo 5: Configurar Contas

Enquanto Claude Code trabalha, você cria as contas (gratuitas):

- **Supabase:** https://supabase.com (banco de dados)
- **Vercel:** https://vercel.com (deploy backend)
- **SendGrid:** https://sendgrid.com (email) OU Gmail com App Password

Quando Claude Code pedir, você fornece as chaves:
```
SUPABASE_URL=
SUPABASE_KEY=
SENDGRID_API_KEY=
ADMIN_EMAIL=
```

## Passo 6: Deploy

Depois que Claude Code terminar:

1. Push final para GitHub
2. Vercel detecta automaticamente (if connected)
3. Testa em staging
4. Conecta domínio `itau.nhbadvocacia.com`
5. Pronto para ir ao ar!

---

## O que Você NÃO Precisa Fazer

❌ Escrever código
❌ Aprender OCR
❌ Configurar Supabase (Claude Code guia)
❌ Entender TypeScript
❌ Configurar Vercel manualmente (é automático)

## O que Você SÓ Precisa Fazer

✅ Criar contas (Supabase, Vercel, SendGrid)
✅ Copiar/colar as chaves de API
✅ Revisar o resultado
✅ Clicar "Deploy" no Vercel
✅ Conectar seu domínio

---

## Exemplo de Conversa com Claude Code

**Você:**
```
Tenho um pacote de design para uma landing page com OCR. 
O README está em design_handoff_ocr_landing/README.md.
Pode estruturar um projeto Next.js completo, pronto para Vercel?
```

**Claude Code:**
```
Claro! Vou:
1. Criar estrutura Next.js
2. Recriar componentes do design
3. Integrar Tesseract.js
4. Implementar API /api/analyze
5. Configurar Supabase
6. Preparar env vars

Deixa eu ver o README primeiro...
[lê design_handoff_ocr_landing/README.md]

Pronto! Criei:
- /app/page.tsx (landing page)
- /app/obrigado/page.tsx (thank you)
- /app/api/analyze/route.ts (backend)
- /lib/ocr.ts (utilitários OCR)
- /lib/email.ts (envio de email)
- .env.example (template de vars)

Próximos passos:
1. Criar contas Supabase/SendGrid
2. Preencher .env.local
3. Testar localmente
4. Fazer push para GitHub
5. Deploy Vercel
```

---

## Troubleshooting

Se algo quebrar, você diz:
- "A OCR não está funcionando no Chrome"
- "O email não está sendo enviado"
- "Quero mudar a cor do botão"

Claude Code corrige/ajusta e te mostra o diff das mudanças.

---

**Você está 100% coberto. Deixa Claude Code fazer a mágica!** ✨
