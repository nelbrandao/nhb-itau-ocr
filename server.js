const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

// Inicializar Supabase (opcional)
let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  const { createClient } = require('@supabase/supabase-js');
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
}

// Configurar email (opcional)
let transporter = null;
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
}

const chargeKeywords = {
  'Seguros': [
    'seguro', 'seg vida', 'seg prest', 'seguro vida', 'seguro prestamista',
    'seguro em grupo', 'vida em grupo', 'seg vida em grupo',
    'cartao protegido', 'cartão protegido', 'prot cartao', 'prot cartão',
    'seguro viagem', 'prot viagem', 'assist viagem',
    'seguro residencial', 'seg residencial',
    'seguro auto', 'seg auto',
    'prestamista', 'segprestamista',
  ],
  'Cesta de Serviços': [
    'cesta', 'cesta serv', 'cesta de serv', 'cesta basica',
    'pacote serv', 'pacote de serv', 'pacote conta',
    'mensalidade conta', 'mensalidade cartao', 'mensalidade cartão',
    'manutencao conta', 'manutenção conta', 'man conta',
    'tarifa manut', 'tar manut', 'tarifa mensal',
    'servico bancario', 'serviço bancário',
  ],
  'Tarifas Bancárias': [
    'tarifa', 'tar ', 'tarifas', 'taxa cobr', 'taxa de serv',
    'anuidade', 'anuidade cartao', 'anuidade cartão',
    'tar saldo', 'tar extrato', 'tar doc', 'tar ted',
    'tar boleto', 'tar saque', 'tar transf',
    'tarifa servicos diferenciados', 'tar serv dif',
    'iof', 'cpmf',
  ],
  'Proteção Financeira': [
    'protecao financeira', 'proteção financeira',
    'prot financ', 'seg financ', 'seguro financeiro',
    'cobertura financ', 'renda protegida',
    'seguro desemprego', 'seg desemp',
    'seguro perda de renda', 'perda renda',
  ],
  'Assistência': [
    'assist residencial', 'assistencia residencial', 'assistência residencial',
    'assist med', 'assist medica', 'assistência médica',
    'assist funeral', 'assist juridica', 'assist jurídica',
    'assist auto', 'assist veicular',
    'club itau', 'clube itau', 'clube itaú',
    'personnalite', 'personnalité',
  ],
  'Encargos e Juros': [
    'juros rotativo', 'juros rot', 'encargo rotativo',
    'multa atraso', 'multa por atraso', 'mora',
    'juros mora', 'juros de mora', 'encargos',
    'juros financiamento', 'juros emprestimo', 'juros empréstimo',
    'cet ', 'custo efetivo', 'iof financiamento',
    'juros parcel', 'juros parcela',
  ],
  'Crédito Pessoal / CDC': [
    'cdc', 'credito pessoal', 'crédito pessoal',
    'emprestimo', 'empréstimo', 'financiamento',
    'parcela emprest', 'parcela financ',
    'consignado', 'credito consig', 'crédito consig',
    'antecipacao', 'antecipação',
  ],
  'Programas e Serviços Extras': [
    'itaucard', 'itaú card', 'itaupersonalite',
    'mastercard', 'visa', 'beneficio', 'benefício',
    'programa pontos', 'milhas', 'fidelidade',
    'debito automatico', 'débito automático', 'deb aut',
    'recorrente', 'cobranca recorr', 'cobrança recorr',
  ],
};

function normalize(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ');
}

function analyzeText(text) {
  const textNorm = normalize(text);
  const detectedCharges = [];

  for (const [category, keywords] of Object.entries(chargeKeywords)) {
    let instances = 0;
    const matched = [];
    keywords.forEach(keyword => {
      const kwNorm = normalize(keyword);
      let pos = 0;
      while ((pos = textNorm.indexOf(kwNorm, pos)) !== -1) {
        instances++;
        if (!matched.includes(keyword)) matched.push(keyword);
        pos += kwNorm.length;
      }
    });

    if (instances > 0) {
      detectedCharges.push({
        category,
        instances,
        confidence: Math.min(95, 55 + instances * 8),
        examples: matched.slice(0, 3),
      });
    }
  }

  return detectedCharges.sort((a, b) => b.confidence - a.confidence);
}

async function sendEmails(clientData, detectedCharges) {
  if (!transporter) return;

  const chargesHtml = detectedCharges.length > 0
    ? `<table border="1" cellpadding="10" style="border-collapse:collapse">
        <tr><th>Categoria</th><th>Ocorrências</th><th>Confiança</th></tr>
        ${detectedCharges.map(c => `<tr><td>${c.category}</td><td>${c.instances}</td><td>${c.confidence}%</td></tr>`).join('')}
       </table>`
    : '<p>Nenhuma cobrança suspeita identificada.</p>';

  const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER;

  await Promise.all([
    transporter.sendMail({
      from: adminEmail,
      to: clientData.clientEmail,
      subject: '📊 Resultado da Análise - N.H. Brandão Advogados',
      html: `<h2>Olá ${clientData.clientName},</h2><p>Resultado da análise do seu documento:</p>${chargesHtml}<p>Nossa equipe entrará em contato. WhatsApp: <a href="https://wa.me/5543991032372">(43) 99103-2372</a></p>`,
    }),
    transporter.sendMail({
      from: adminEmail,
      to: adminEmail,
      subject: `[LEAD] ${clientData.clientName} - ${detectedCharges.length} categorias`,
      html: `<h2>Novo Lead</h2><p><b>Nome:</b> ${clientData.clientName}</p><p><b>Email:</b> ${clientData.clientEmail}</p><p><b>WhatsApp:</b> ${clientData.clientPhone}</p><p><b>CPF:</b> ${clientData.clientCPF}</p><p><b>Cidade/UF:</b> ${clientData.clientCity}/${clientData.clientState}</p>${chargesHtml}`,
    }),
  ]);
}

// CORS para todas as rotas
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'landing.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', supabase: !!supabase, email: !!transporter });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { extractedText, clientName, clientEmail, clientCPF, clientPhone, clientCity, clientState, bankAccount, documentType } = req.body;

    if (!extractedText || !clientName || !clientEmail) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const detectedCharges = analyzeText(extractedText);
    const confidenceScore = detectedCharges.length > 0
      ? Math.round(detectedCharges.reduce((sum, c) => sum + c.confidence, 0) / detectedCharges.length)
      : 0;

    // Salvar no Supabase se configurado
    if (supabase) {
      const { error } = await supabase.from('analyses').insert([{
        client_name: clientName, client_email: clientEmail,
        client_cpf: clientCPF, client_phone: clientPhone,
        client_city: clientCity, client_state: clientState,
        bank_account: bankAccount, document_type: documentType,
        extracted_text: extractedText, detected_charges: detectedCharges,
        confidence_score: confidenceScore, created_at: new Date().toISOString(),
      }]);
      if (error) console.error('Supabase Error:', error);
    }

    // Enviar emails se configurado
    sendEmails({ clientName, clientEmail, clientCPF, clientPhone, clientCity, clientState }, detectedCharges)
      .catch(err => console.error('Email Error:', err));

    return res.status(200).json({
      success: true,
      detectedCharges,
      confidenceScore,
      message: 'Análise realizada com sucesso.',
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Erro ao processar análise' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 NHB OCR Landing rodando na porta ${PORT}`);
  console.log(`   Supabase: ${supabase ? '✅' : '⚠️ não configurado'}`);
  console.log(`   Email:    ${transporter ? '✅' : '⚠️ não configurado'}`);
});
