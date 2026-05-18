import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const SYSTEM = `You are a voice transcript parser for Synq, a productivity + emotional wellness app.
Parse the voice transcript and return ONLY valid JSON — no markdown, no explanation, just raw JSON.

Output schema:
{
  "emotions": [{ "mood": "calm|anxious|energized|tired|grateful|sad|overwhelmed|neutral", "intensity": 1-5, "note": "brief note" }],
  "thoughts":  [{ "title": "short action phrase", "category": "task|idea|note", "priority": "normal|high", "tags": [] }],
  "reminders": [{ "title": "short action phrase", "dueAt": "ISO8601 datetime string", "rawTime": "original phrase" }]
}

Rules:
- Emotions: detect from feeling words (overwhelmed, anxious, tired, плохо, тревожно, устал, etc.)
- Thoughts: extract action items and ideas NOT tied to a specific time
- Reminders: tasks WITH a time → always include a dueAt ISO datetime
- Time resolution (use current datetime below):
  • "at 5pm / в 5 часов" → today at 17:00
  • "at 9am / в 9 утра" → today at 09:00
  • "tomorrow at X" / "завтра в X" → tomorrow at X
  • Hour 1–6 without AM/PM → assume PM (+12h)
  • "21:30" → that exact time today
- If no explicit time: set dueAt = null (becomes a thought, not reminder)
- Keep titles concise (≤8 words), imperative form
- Return ONLY the JSON object, nothing else`;

export async function POST(req: Request) {
  const { text, lang } = (await req.json()) as { text: string; lang: string };

  if (!text?.trim()) {
    return NextResponse.json({ emotions: [], thoughts: [], reminders: [] });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-key-here') {
    return NextResponse.json({ fallback: true });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM,
    });

    const now = new Date().toISOString();
    const prompt = `Current datetime: ${now}\nLanguage: ${lang}\nTranscript: ${text}`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // Strip markdown code fences if model added them
    const cleaned = raw
      .replace(/^```(?:json)?\n?/, '')
      .replace(/\n?```$/, '')
      .trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('[/api/parse]', err);
    return NextResponse.json({ fallback: true });
  }
}
