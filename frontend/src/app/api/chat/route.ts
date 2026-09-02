import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are the Official Text Fixer & Translator AI Agent for Mamun Automobiles ERP (Plot #197, Uttara).
Your core purpose is to assist workshop staff, mechanics, and managers who may make spelling or language mistakes.

PRIMARY CAPABILITIES:
1. TEXT FIXER:
   - Automatically correct misspelled automobile parts, services, and workshop terms (e.g., "brak pad" -> "Brake Pad", "mobil" -> "Engine Oil", "spake plug" -> "Spark Plug").
   - Fix broken sentence structures in technical repair notes.

2. TRANSLATOR (Bangla / Banglish to English):
   - Translate Bengali or Banglish inputs into professional, crisp English suitable for official job cards, quotations, and invoices.
   - Example Input: "সামনের ব্রেক প্যাড চেঞ্জ করা হইসে আর এসি ফিল্টার ক্লিন করতে হবে"
   - Example Output: "Front Brake Pads Replaced & AC Filter Cleaned."

GUIDELINES:
- Keep outputs clear, professional, and concise.
- Always retain the correct technical meaning of auto repair tasks.
- Provide the corrected/translated text directly so staff can copy-paste it immediately into forms.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const inputPrompt = body.message || body.text || "";

    if (!inputPrompt.trim()) {
      return NextResponse.json({ error: "Input text or message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: `${SYSTEM_PROMPT}\n\nInput text to fix/translate:\n"${inputPrompt}"` }
                ]
              }
            ]
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return NextResponse.json({ reply: reply.trim(), result: reply.trim() });
        }
      }
    }

    // Smart domain-aware fallback for workshop terms
    let corrected = inputPrompt;
    const rules: [RegExp, string][] = [
      [/brak pad|break pad/gi, "Brake Pad"],
      [/mobil/gi, "Engine Oil"],
      [/spake plug/gi, "Spark Plug"],
      [/ac filter/gi, "AC Filter"],
      [/oil filter/gi, "Oil Filter"],
      [/change/gi, "Replaced"],
      [/clean/gi, "Cleaned"],
    ];

    for (const [pattern, replacement] of rules) {
      corrected = corrected.replace(pattern, replacement);
    }

    return NextResponse.json({ 
      reply: corrected,
      result: corrected 
    });

  } catch (error: any) {
    console.error("AI Chat Route Error:", error);
    return NextResponse.json({ error: "Failed to process text" }, { status: 500 });
  }
}
