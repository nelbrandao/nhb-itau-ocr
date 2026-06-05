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
  'Seguros': ['seguro', 'proteção vida', 'prestamista', 'cartão protegido', 'proteção viagem'],
  'Cesta de Serviços': ['cesta', 'pacote', 'serviços bancários', 'combo'],
  'Tarifas': ['tarifa', 'taxa', 'manutenção', 'anuidade'],
  'Proteção Financeira': ['proteção', 'financeira', 'cobertura'],
  'Assistência': ['assistência', 'auxílio', 'suporte', 'socorro'],
  'Bolsa Protegida': ['bolsa protegida', 'bolsa segura'],
  'Encargos': ['encargo', 'juros', 'multa', 'mora'],
  'Serviços de Terceiros': ['terceiros', 'serviço de terceiros', 'outsourcing'],
  'Recorrente': ['recorrente', 'periódico', 'mensal', 'semanal'],
};

function analyzeText(text) {
  const textLower = text.toLowerCase();
  const detectedCharges = [];

  for (const [category, keywords] of Object.entries(chargeKeywords)) {
    let instances = 0;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = textLower.match(regex);
      if (matches) instances += matches.length;
    });

    if (instances > 0) {
      detectedCharges.push({
        category,
        instances,
        confidence: Math.min(100, 60 + instances * 10),
        examples: keywords.slice(0, 3),
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
