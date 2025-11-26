import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) { // <--- AQUI COMEÇA A FUNÇÃO
  
  // --- ADICIONE ESTAS LINHAS PARA TESTAR ---
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("--- DEBUG START ---");
  console.log("Tem chave configurada?", apiKey ? "SIM, A CHAVE EXISTE" : "NÃO, ESTÁ VAZIA");
  if (apiKey) console.log("Começo da chave:", apiKey.substring(0, 5) + "...");
  console.log("--- DEBUG END ---");
  // ----------------------------------------

  // Se a chave não existir, nem tenta criar o GoogleGenerativeAI para não quebrar
  if (!apiKey) {
      return NextResponse.json(
        { error: "Chave de API não configurada no servidor." },
        { status: 500 }
      );
  }

  const genAI = new GoogleGenerativeAI(apiKey); // Movemos para dentro para usar a variável segura

  try {
    const { image, description } = await req.json();

    if (!image && !description) {
      return NextResponse.json(
        { error: "Imagem ou descrição são obrigatórios" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Instrução DO SISTEMA para garantir precisão e formato JSON
    const prompt = `
      Você é um especialista experiente em reparos domésticos ("Marido de Aluguel" profissional).
      
      CONTEXTO DO USUÁRIO:
      Descrição do problema: "${description || "Nenhuma descrição fornecida"}"
      (Analise também a imagem fornecida em base64 se houver).

      TAREFA:
      Identifique o problema exato e forneça um guia passo a passo preciso.
      Se o usuário perguntou algo específico (ex: "como trocar só a lâmpada"), ignore problemas complexos e foque APENAS na dúvida dele.

      FORMATO DE RESPOSTA OBRIGATÓRIO (JSON PURO):
      Retorne APENAS um objeto JSON com esta estrutura exata, sem markdown, sem crase, sem \`\`\`json no inicio:
      {
        "problem": "Título curto do problema identificado",
        "difficulty": "Fácil" | "Médio" | "Difícil",
        "estimatedTime": "ex: 10-15 min",
        "estimatedCost": "ex: R$ 0-10",
        "tools": ["Lista", "de", "ferramentas", "necessárias"],
        "materials": ["Lista", "de", "materiais", "necessários"],
        "steps": ["Passo 1 detalhado", "Passo 2 detalhado", "etc"],
        "tips": ["Dica de segurança 1", "Dica pro 2"]
      }
    `;

    // Prepara os dados para o Gemini
    const parts: any[] = [{ text: prompt }];

    if (image) {
      // Remove o prefixo do base64 se existir
      const base64Data = image.includes("base64,") ? image.split(",")[1] : image;
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      });
    }

    // Gera a resposta
    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    console.log("Resposta da IA:", text); // Para debug no terminal

    // Limpeza extra para garantir que é um JSON válido
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const analysisData = JSON.parse(cleanText);

    return NextResponse.json(analysisData);

  } catch (error) {
    console.error("Erro na API Gemini:", error);
    return NextResponse.json(
      { error: "Falha ao processar inteligência artificial." },
      { status: 500 }
    );
  }
}