/**
 * API Backend para Análise de Cobranças Bancárias
 * Deploy: Vercel Serverless Functions
 * Endpoint: POST /api/analyze
 */

const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

// Keywords para detectar cobranças suspeitas
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

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Configurar Nodemailer (SendGrid ou Gmail)
let transporter;

if (process.env.SENDGRID_API_KEY) {
  const sgTransport = require('nodemailer-sendgrid-transport');
  transporter = nodemailer.createTransport(
    sgTransport({
      auth: {
        api_key: process.env.SENDGRID_API_KEY,
      },
    })
  );
} else {
  // Fallback para Gmail
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

/**
 * Analisar texto extraído por OCR
 * @param {string} text - Texto extraído do documento
 * @returns {Array} Array com cobranças detectadas
 */
function analyzeText(text) {
  const textLower = text.toLowerCase();
  const detectedCharges = [];

  for (const [category, keywords] of Object.entries(chargeKeywords)) {
    let instances = 0;
    let confidence = 0;

    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = textLower.match(regex);
      if (matches) {
        instances += matches.length;
      }
    });

    if (instances > 0) {
      // Calcular confiança baseada em frequência (0-100%)
      confidence = Math.min(100, 60 + instances * 10);

      detectedCharges.push({
        category,
        instances,
        confidence,
        examples: keywords.slice(0, 3),
      });
    }
  }

  // Ordenar por confiança (decrescente)
  return detectedCharges.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Enviar email para cliente
 */
async function sendClientEmail(clientData, detectedCharges) {
  const chargesHtml = detectedCharges.length > 0
    ? `<table border="1" cellpadding="10" style="border-collapse: collapse;">
        <tr><th>Categoria</th><th>Ocorrências</th><th>Confiança</th></tr>
        ${detectedCharges.map(c => `<tr><td>${c.category}</td><td>${c.instances}</td><td>${c.confidence}%</td></tr>`).join('')}
       </table>`
    : '<p>Nenhuma cobrança suspeita identificada.</p>';

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: clientData.clientEmail,
    subject: '📊 Resultado da Análise de Cobranças - N.H. Brandão Advogados',
    html: `
      <h2>Olá ${clientData.clientName},</h2>
      <p>Recebemos seu documento para análise. Aqui estão os resultados:</p>
      <h3>Cobranças Suspeitas Detectadas:</h3>
      ${chargesHtml}
      <p><strong>⚠️ Aviso Legal:</strong> Esta é uma análise inicial automatizada. Nossa equipe jurídica entrará em contato em breve para discussão detalhada das próximas etapas e possibilidades de recuperação.</p>
      <p>Qualquer dúvida, entre em contato conosco via WhatsApp: <a href="https://wa.me/5543991032372">(43) 99103-2372</a></p>
      <hr>
      <p style="font-size: 12px; color: #666;">
        © 2024 N.H. Brandão Advogados<br>
        Especialistas em Direitos Bancários
      </p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Enviar email para admin
 */
async function sendAdminEmail(clientData, detectedCharges) {
  const chargesHtml = detectedCharges.length > 0
    ? `<table border="1" cellpadding="10" style="border-collapse: collapse;">
        <tr><th>Categoria</th><th>Ocorrências</th><th>Confiança</th></tr>
        ${detectedCharges.map(c => `<tr><td>${c.category}</td><td>${c.instances}</td><td>${c.confidence}%</td></tr>`).join('')}
       </table>`
    : '<p>Nenhuma cobrança suspeita.</p>';

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `[NOVO LEAD] Análise: ${clientData.clientName}`,
    html: `
      <h2>Nova Análise Recebida</h2>
      <p><strong>Cliente:</strong> ${clientData.clientName}</p>
      <p><strong>Email:</strong> ${clientData.clientEmail}</p>
      <p><strong>CPF:</strong> ${clientData.clientCPF}</p>
      <p><strong>WhatsApp:</strong> ${clientData.clientPhone}</p>
      <p><strong>Cidade/Estado:</strong> ${clientData.clientCity}/${clientData.clientState}</p>
      <p><strong>Tipo de Conta:</strong> ${clientData.bankAccount}</p>
      <p><strong>Tipo de Documento:</strong> ${clientData.documentType}</p>
      <h3>Cobranças Detectadas:</h3>
      ${chargesHtml}
      <p><strong>Total de categorias suspeitas:</strong> ${detectedCharges.length}</p>
      <hr>
      <p><a href="https://supabase.co/dashboard">Ir para Supabase Dashboard</a></p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Handler principal da API
 */
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      extractedText,
      clientName,
      clientEmail,
      clientCPF,
      clientPhone,
      clientCity,
      clientState,
      bankAccount,
      documentType,
    } = req.body;

    // Validações básicas
    if (!extractedText || !clientName || !clientEmail) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Analisar texto
    const detectedCharges = analyzeText(extractedText);

    // Calcular confiança média
    const confidenceScore = detectedCharges.length > 0
      ? Math.round(detectedCharges.reduce((sum, c) => sum + c.confidence, 0) / detectedCharges.length)
      : 0;

    // Salvar no Supabase
    const { data, error } = await supabase
      .from('analyses')
      .insert([
        {
          client_name: clientName,
          client_email: clientEmail,
          client_cpf: clientCPF,
          client_phone: clientPhone,
          client_city: clientCity,
          client_state: clientState,
          bank_account: bankAccount,
          document_type: documentType,
          extracted_text: extractedText,
          detected_charges: detectedCharges,
          confidence_score: confidenceScore,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ error: 'Erro ao salvar análise no banco de dados' });
    }

    // Enviar emails em paralelo (não bloqueia resposta)
    Promise.all([
      sendClientEmail({ clientName, clientEmail }, detectedCharges),
      sendAdminEmail(
        { clientName, clientEmail, clientCPF, clientPhone, clientCity, clientState, bankAccount, documentType },
        detectedCharges
      ),
    ]).catch((err) => {
      console.error('Email Error:', err);
      // Log apenas - não quebra a resposta
    });

    // Responder com sucesso
    return res.status(200).json({
      success: true,
      detectedCharges,
      confidenceScore,
      message: 'Análise realizada com sucesso. Confira seu email.',
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Erro ao processar análise' });
  }
};
