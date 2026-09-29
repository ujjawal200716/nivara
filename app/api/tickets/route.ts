import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { createClient } from '@/utils/supabase/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an elite AI triage assistant for a housing society.
Your job is to process messy, code-mixed (Hinglish) complaints and output a structured JSON response.
Determine the category (Lift, Water, Parking, Noise, Cleaning, Security, Other) and urgency (Critical, High, Medium, Low).
Also, draft a 1-click status update action_draft for the residents.
Output ONLY JSON matching this format:
{
  "translated_message": "English translation",
  "category": "Category",
  "urgency": "Urgency",
  "action_draft": "Draft response"
}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Process with Groq
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
      model: 'qwen/qwen3.8-27b',
      response_format: { type: 'json_object' },
    });

    const aiResponseStr = completion.choices[0]?.message?.content;
    if (!aiResponseStr) throw new Error("No response from Groq");
    
    const parsedData = JSON.parse(aiResponseStr);

    // Initialize Supabase and save the ticket
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('tickets')
      .insert([
        {
          raw_message: message,
          translated_message: parsedData.translated_message,
          category: parsedData.category,
          urgency: parsedData.urgency,
          action_draft: parsedData.action_draft,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
