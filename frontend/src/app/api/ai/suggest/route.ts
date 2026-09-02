import { NextResponse } from 'next/server';

const SUGGEST_SYSTEM_PROMPT = `
You are the Dual-Language Automotive Terminology & Spell Corrector for Mamun Automobiles ERP (Plot #197, Uttara).
Your task is to correct misspelled automotive parts, fluids, services, and repair terms in BOTH English and Bangla (including Banglish/Phonetic Bangla).

OUTPUT REQUIREMENT:
Return ONLY a raw valid JSON object matching this schema:
{
  "original": string,
  "corrected": string,
  "language": "bn" | "en",
  "isError": boolean
}
Do NOT include markdown formatting.

EXAMPLES:
1. Bangla Input: "ইন্জিন ওয়েল" -> {"original": "ইন্জিন ওয়েল", "corrected": "ইঞ্জিন অয়েল", "language": "bn", "isError": true}
2. Bangla Input: "ব্রেক পেড চেন্জ" -> {"original": "ব্রেক পেড চেন্জ", "corrected": "ব্রেক প্যাড পরিবর্তন", "language": "bn", "isError": true}
3. Bangla Input: "শব্দ আইতেসে" -> {"original": "শব্দ আইতেসে", "corrected": "অস্বাভাবিক শব্দ", "language": "bn", "isError": true}
4. English Input: "brak pad" -> {"original": "brak pad", "corrected": "Brake Pad", "language": "en", "isError": true}
5. Correct Input: "Brake Pad" -> {"original": "Brake Pad", "corrected": "Brake Pad", "language": "en", "isError": false}
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = body.text || body.message || '';

    if (!text.trim()) {
      return NextResponse.json({ original: text, corrected: text, language: 'en', isError: false });
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
                parts: [{ text: `${SUGGEST_SYSTEM_PROMPT}\n\nCheck input term:\n"${text}"` }],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          try {
            const clean = rawJson.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(clean);
            return NextResponse.json(parsed);
          } catch (e) {}
        }
      }
    }

    // High-precision Dual-Language fallback rule dictionary
    let corrected = text;
    let isError = false;
    let lang: 'bn' | 'en' = /[\u0980-\u09FF]/.test(text) ? 'bn' : 'en';

    const bnRules: [RegExp, string][] = [
      [/ইন্জিন ওয়েল|ইন্জিন অয়েল|ইঞ্জিন ওয়েল/gi, 'ইঞ্জিন অয়েল'],
      [/ব্রেক পেড|ব্রেক পেড চেন্জ/gi, 'ব্রেক প্যাড পরিবর্তন'],
      [/শব্দ আইতেসে|আওয়াজ আইতেসে/gi, 'অস্বাভাবিক শব্দ'],
      [/এসি ফিল্টার সাফ/gi, 'এসি ফিল্টার পরিস্কার'],
    ];

    const enRules: [RegExp, string][] = [
      [/brak pad|break pad/gi, 'Brake Pad'],
      [/engene oil|engine ol|mobil/gi, 'Engine Oil'],
      [/spake plug|sparkp/gi, 'Spark Plug'],
      [/ac filter|a c filter/gi, 'AC Filter'],
      [/ol filter|oil fitr/gi, 'Oil Filter'],
    ];

    const activeRules = lang === 'bn' ? bnRules : enRules;

    for (const [pattern, replacement] of activeRules) {
      if (pattern.test(corrected)) {
        isError = true;
        corrected = corrected.replace(pattern, replacement);
      }
    }

    return NextResponse.json({
      original: text,
      corrected: isError ? corrected : text,
      language: lang,
      isError: isError,
    });
  } catch (err: any) {
    console.error('Suggest API Error:', err);
    return NextResponse.json({ original: '', corrected: '', language: 'en', isError: false });
  }
}
