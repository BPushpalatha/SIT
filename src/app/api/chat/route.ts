import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const message = body?.message;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      // If running in development, return a helpful mock response so the UI remains usable.
      if (process.env.NODE_ENV !== 'production') {
        console.warn('GROQ_API_KEY is not set — returning dev mock reply')
        return NextResponse.json({ response: "[DEV MOCK] Hello! GROQ API key is not configured. Set GROQ_API_KEY in your .env.local to enable the real chat." })
      }

      console.error('GROQ_API_KEY is not set')
      return NextResponse.json({ error: 'Server configuration error: GROQ API key is missing' }, { status: 500 })
    }

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const campusContext = `You are an AI assistant for Siddaganga Institute of Technology (SITE).\nYou help with:\n- Room availability\n- Timetables\n- Events\n- Canteen info\n- Issue reporting\n- Study materials\nReply friendly and useful.`;

    // call GROQ chat completion and guard against errors
    let completion
    try {
      completion = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: campusContext },
          { role: "user", content: message },
        ],
        max_tokens: 300,
      })
    } catch (e) {
      console.error('GROQ SDK error:', e)
      return NextResponse.json({ error: 'Upstream API error from GROQ' }, { status: 502 })
    }

    const reply = completion?.choices?.[0]?.message?.content || null

    if (!reply) {
      return NextResponse.json({ error: 'No reply from model' }, { status: 502 })
    }

    return NextResponse.json({ response: reply })

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
