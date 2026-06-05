import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface AnalysisRequest {
  extractedText: string;
  clientName: string;
  clientEmail: string;
  clientCPF: string;
  clientPhone: string;
  clientCity: string;
  clientState: string;
  bankAccount: string;
  documentType: string;
}

interface DetectedCharge {
  category: string;
  instances: number;
  confidence: number;
  examples: string[];
}

const chargeKeywords: Record<string, string[]> = {
  Seguros: [
    "seguro",
    "proteção vida",
    "prestamista",
    "cartão protegido",
    "seguro cartão",
    "segurado",
  ],
  "Cesta de Serviços": [
    "cesta",
    "pacote",
    "serviços bancários",
    "combo",
    "plano",
  ],
  Tarifas: [
    "tarifa",
    "taxa",
    "manutenção",
    "taxa bancária",
    "anuidade",
    "cobrada",
  ],
  "Proteção Financeira": [
    "proteção",
    "financeira",
    "seguro financeiro",
    "proteção de crédito",
  ],
  Assistência: [
    "assistência",
    "auxílio",
    "suporte",
    "atendimento",
    "assistência 24h",
  ],
  "Bolsa Protegida": ["bolsa protegida", "bolsa", "investimento protegido"],
  Anuidade: ["anuidade", "anual", "renovação anual"],
  Encargos: ["encargo", "juros", "multa", "penalidade"],
  "Serviços de Terceiros": ["terceiros", "serviço de terceiros", "terceiro"],
  Recorrente: ["recorrente", "periódico", "mensal", "cobrado mensalmente"],
};

function analyzeText(text: string): DetectedCharge[] {
  const detectedCharges: Record<string, DetectedCharge> = {};
  const lowerText = text.toLowerCase();

  for (const [category, keywords] of Object.entries(chargeKeywords)) {
    let totalMatches = 0;
    const examples: string[] = [];

    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\w*\\b`, "gi");
      const matches = lowerText.match(regex);

      if (matches) {
        totalMatches += matches.length;
        examples.push(...matches.slice(0, 2)); // Primeiros 2 exemplos
      }
    }

    if (totalMatches > 0) {
      const confidence = Math.min(100, totalMatches * 15); // Escala de confiança
      detectedCharges[category] = {
        category,
        instances: totalMatches,
        confidence,
        examples: [...new Set(examples)].slice(0, 3),
      };
    }
  }

  return Object.values(detectedCharges).sort(
    (a, b) => b.confidence - a.confidence
  );
}

function formatAnalysisForEmail(
  request: AnalysisRequest,
  charges: DetectedCharge[]
): string {
  let html = `
    <h2>🔍 Relatório de Análise de Cobrança</h2>
    
    <h3>📋 Dados do Cliente:</h3>
    <ul>
      <li><strong>Nome:</strong> ${request.clientName}</li>
      <li><strong>CPF:</strong> ${request.clientCPF}</li>
      <li><strong>Email:</strong> ${request.clientEmail}</li>
      <li><strong>WhatsApp:</strong> ${request.clientPhone}</li>
      <li><strong>Localização:</strong> ${request.clientCity}, ${request.clientState}</li>
      <li><strong>Tipo de Conta:</strong> ${request.bankAccount}</li>
      <li><strong>Documento Enviado:</strong> ${request.documentType}</li>
    </ul>

    <h3>🎯 Cobranças Detectadas:</h3>
  `;

  if (charges.length === 0) {
    html += "<p>✓ Nenhuma cobrança suspeita detectada neste documento.</p>";
  } else {
    html += "<table border='1' cellpadding='10' style='width: 100%; border-collapse: collapse;'>";
    html +=
      "<tr style='background-color: #f0f0f0;'><th>Categoria</th><th>Ocorrências</th><th>Confiança</th><th>Exemplos</th></tr>";

    for (const charge of charges) {
      const confidenceBar =
        "█".repeat(Math.round(charge.confidence / 10)) +
        "░".repeat(10 - Math.round(charge.confidence / 10));
      html += `
        <tr>
          <td><strong>${charge.category}</strong></td>
          <td>${charge.instances}</td>
          <td>${confidenceBar} ${charge.confidence}%</td>
          <td>${charge.examples.join(", ")}</td>
        </tr>
      `;
    }

    html += "</table>";
  }

  html += `
    <h3>⚖️ Próximos Passos:</h3>
    <p>
      A análise foi realizada automaticamente com Tesseract OCR. 
      Você pode entrar em contato com o cliente para discussão dos resultados.
    </p>
    
    <hr>
    <p style="font-size: 12px; color: #666;">
      <strong>Aviso:</strong> Esta análise é automática e preliminar. 
      Recomenda-se verificação manual antes de qualquer ação jurídica.
    </p>
  `;

  return html;
}

async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string
): Promise<boolean> {
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (sendgridApiKey) {
    // Usar SendGrid
    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sendgridApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to }],
            },
          ],
          from: {
            email: "noreply@nhbadvocacia.com",
            name: "N.H. Brandão Advogados",
          },
          subject,
          content: [
            {
              type: "text/html",
              value: htmlContent,
            },
          ],
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("SendGrid error:", error);
      return false;
    }
  }

  if (gmailUser && gmailPass) {
    // Usar Gmail (requer nodemailer no vercel.json)
    try {
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      await transporter.sendMail({
        from: gmailUser,
        to,
        subject,
        html: htmlContent,
      });

      return true;
    } catch (error) {
      console.error("Gmail error:", error);
      return false;
    }
  }

  console.warn("No email service configured");
  return false;
}

async function saveToSupabase(
  request: AnalysisRequest,
  charges: DetectedCharge[],
  extractedText: string
): Promise<boolean> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase not configured");
    return false;
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/analyses`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_name: request.clientName,
        client_email: request.clientEmail,
        client_cpf: request.clientCPF,
        client_phone: request.clientPhone,
        client_city: request.clientCity,
        client_state: request.clientState,
        bank_account: request.bankAccount,
        document_type: request.documentType,
        extracted_text: extractedText.substring(0, 5000), // Limita tamanho
        detected_charges: charges,
        confidence_score:
          charges.length > 0
            ? charges.reduce((sum, c) => sum + c.confidence, 0) /
              charges.length
            : 0,
        created_at: new Date().toISOString(),
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Supabase error:", error);
    return false;
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const request: AnalysisRequest = req.body;

    // Validações
    if (!request.extractedText || request.extractedText.length < 10) {
      return res.status(400).json({
        error: "Texto extraído insuficiente. Verifique o documento enviado.",
      });
    }

    if (!request.clientEmail || !request.clientName) {
      return res.status(400).json({ error: "Dados do cliente incompletos" });
    }

    // Analisar texto
    const detectedCharges = analyzeText(request.extractedText);

    // Salvar no Supabase
    await saveToSupabase(request, detectedCharges, request.extractedText);

    // Enviar email
    const emailContent = formatAnalysisForEmail(request, detectedCharges);
    await sendEmail(
      request.clientEmail,
      "Resultado da Análise de Cobrança Bancária",
      emailContent
    );

    // Enviar para você
    await sendEmail(
      process.env.ADMIN_EMAIL || "contato@nhbadvocacia.com",
      `Nova Análise: ${request.clientName} - ${request.clientCPF}`,
      emailContent
    );

    return res.status(200).json({
      success: true,
      detectedCharges,
      message: "Análise realizada com sucesso. Confira seu email.",
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return res.status(500).json({
      error: "Erro ao processar análise. Tente novamente.",
    });
  }
}
