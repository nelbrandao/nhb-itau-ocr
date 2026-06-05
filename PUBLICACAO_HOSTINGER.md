# 🚀 Guia de Publicação na Hostinger

## Passo 1: Preparar os Arquivos

Você tem 3 arquivos para enviar:
```
- index.html
- obrigado.html
- logo-nhb-transparent.png
```

## Passo 2: Acessar o Painel Hostinger

1. Acesse **hpanel.hostinger.com**
2. Faça login com suas credenciais
3. Selecione o domínio **nhbadvocacia.com**

## Passo 3: Acessar o Gerenciador de Arquivos

### Opção A: Via File Manager (mais fácil)
1. No painel, clique em **"File Manager"** ou **"Gerenciador de Arquivos"**
2. Navegue até a pasta **public_html**
3. Crie uma nova pasta chamada **itau**
4. Entre nela

### Opção B: Via FTP (se preferir)
- **Host FTP:** seu domínio ou IP fornecido
- **Usuário:** seu email ou usuário FTP
- **Senha:** a mesma do painel
- Use um cliente FTP como **FileZilla** ou **WinSCP**

## Passo 4: Upload dos Arquivos

### Via File Manager:
1. Dentro da pasta `/public_html/itau/`
2. Clique em **"Upload"** ou arraste os arquivos
3. Envie:
   - `index.html`
   - `obrigado.html`
   - `logo-nhb-transparent.png`

### Via FTP:
1. Arraste os arquivos para `/public_html/itau/`
2. Espere o upload terminar

## Passo 5: Verificar a Publicação

Acesse: **www.nhbadvocacia.com/itau**

Se os arquivos estiverem certos, você verá a landing page carregando normalmente.

## Possíveis Problemas

### ❌ Erro 404
- Verifique se os arquivos estão em `/public_html/itau/`
- Caso precise da raiz, coloque em `/public_html/` direto

### ❌ Logo não aparece
- Verifique se `logo-nhb-transparent.png` está no mesmo diretório que `index.html`
- Limpe o cache do navegador (Ctrl+F5)

### ❌ Formulário não funciona
- O formulário redireciona para `obrigado.html` (está funcionando como demo)
- Para receber dados reais, você precisará de backend (email/Supabase)

## Próximos Passos (Opcional)

### Para Receber os Dados do Formulário:

**Opção 1: Usar Supabase (recomendado)**
- Criar conta em supabase.com
- Criar tabela para armazenar respostas
- Integrar API no formulário

**Opção 2: Usar Formspree.io (mais fácil)**
- Ir em formspree.io
- Conectar seu email
- Trocar action do formulário para endpoint deles

**Opção 3: Backend customizado**
- Node.js + Express
- Receber dados e enviar email

## Estrutura de Pastas na Hostinger

```
public_html/
├── index.html (página inicial)
├── outros arquivos do site...
└── itau/                          ← Sua landing page
    ├── index.html
    ├── obrigado.html
    └── logo-nhb-transparent.png
```

## Dúvidas?

Se tiver problemas:
1. Verifique se o domínio está apontando corretamente
2. Limpe cache do navegador
3. Espere alguns minutos para propagação DNS
4. Entre em contato com suporte Hostinger

---

**Status:** ✅ Arquivos prontos para publicação
**Domínio:** www.nhbadvocacia.com/itau
**Próximo:** Após publicar, teste em todos os navegadores e mobile
