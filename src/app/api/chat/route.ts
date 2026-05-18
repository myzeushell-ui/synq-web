import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const SYSTEM = `You are Synq — a warm, calm, non-judgmental AI companion inside a wellness + productivity app.
Your tone: gentle, grounding, never clinical. Like a thoughtful friend who happens to be wise.

Rules:
- Keep every response to 2–3 sentences max
- Never give medical diagnoses or advice
- If user mentions a task, gently help break it into one tiny next step
- If user is overwhelmed, validate first, then ask one small question
- Respond in the SAME language the user writes in (Russian → Russian, English → English)
- No lists, no bullet points — just warm flowing text
- Never start with "I" — vary your openings`;

interface HistoryMsg {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  const { message, history } = (await req.json()) as {
    message: string;
    history: HistoryMsg[];
  };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-key-here') {
    return NextResponse.json({ text: null, fallback: true });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM,
    });

    // Build conversation history for Gemini
    const geminiHistory = history.slice(-10).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (err) {
    console.error('[/api/chat]', err);
    return NextResponse.json({ text: null, fallback: true });
  }
}
