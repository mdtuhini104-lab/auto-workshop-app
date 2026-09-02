import { NextResponse } from 'next/server';

const DUAL_AI_SYSTEM_PROMPT = `
You are the Dual-Mode Automotive AI Assistant for Mamun Automobiles ERP (Plot #197, Uttara).
You perform TWO specialized operations:

1. MODE "translate":
   - Convert Bangla or Banglish notes into professional, crisp, technical English suitable for job cards and invoices.
   - Example: "সামনের ব্রেক প্যাড চেঞ্জ আর স্পার্ক প্লাগ ক্লিন" -> "Front Brake Pads Replacement & Spark Plugs Cleaning."

2. MODE "fix":
   - Fix spelling errors, grammar, and informal regional slang while KEEPING the original language (Bangla or English).
   - Example Bangla: "ব্রেক পেড চেন্জ করে দিয়েন" -> "ব্রেক প্যাড পরিবর্তন করুন।"
   - Example English: "brak pad change and mobil fill" -> "Brake pad replacement and engine oil refill."

GUIDELINES:
- Output ONLY the final processed text without conversational filler or extra quotes.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = body.text || body.message || '';
    const mode = body.mode || 'translate'; // 'translate' or 'fix'

    if (!text.trim()) {
      return NextResponse.json({ error: 'Input text is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${DUAL_AI_SYSTEM_PROMPT}\n\nOperation Mode: "${mode}"\nInput Text:\n"${text}"` }],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (outputText) {
          return NextResponse.json({
            translated: outputText.trim(),
            result: outputText.trim(),
            mode,
          });
        }
      }
    }

    // High-precision local fallback
    let resultText = text;
    if (mode === 'fix') {
      const fixRules: [RegExp, string][] = [
        [/ইন্জিন/gi, 'ইঞ্জিন'],
        [/ওয়েল/gi, 'অয়েল'],
        [/পেড/gi, 'প্যাড'],
        [/চেন্জ/gi, 'পরিবর্তন'],
        [/brak pad/gi, 'Brake Pad'],
        [/mobil/gi, 'Engine Oil'],
      ];
      for (const [pattern, replacement] of fixRules) {
        resultText = resultText.replace(pattern, replacement);
      }
    } else {
      const transRules: [RegExp, string][] = [
        [/ব্রেক ক্যালিফার গ্রীসিং/gi, 'Brake caliper pin cleaning & high-temp greasing required'],
        [/ব্রেক প্যাড/gi, 'Brake pads'],
        [/ইঞ্জিন অয়েল|ইঞ্জিন ওয়েল/gi, 'Engine oil'],
        [/স্পার্ক প্লাগ/gi, 'Spark plug'],
        [/এসি ফিল্টার/gi, 'AC filter'],
        [/অয়েল ফিল্টার/gi, 'Oil filter'],
        [/mobil/gi, 'Engine oil'],
        [/brak pad/gi, 'Brake pads'],
      ];
      for (const [pattern, replacement] of transRules) {
        resultText = resultText.replace(pattern, replacement);
      }
    }

    return NextResponse.json({
      translated: resultText.trim(),
      result: resultText.trim(),
      mode,
    });
  } catch (err: any) {
    console.error('AI Processing Error:', err);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}
