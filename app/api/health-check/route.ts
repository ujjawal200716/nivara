import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const result: {
    groq: { status: "connected" | "error"; model?: string; latencyMs?: number; message?: string };
    supabase: { status: "connected" | "error"; url?: string; message?: string };
  } = {
    groq: { status: "error" },
    supabase: { status: "error" }
  };

  // 1. Test Groq
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    result.groq = { status: "error", message: "GROQ_API_KEY is missing from environment" };
  } else {
    try {
      const startTime = Date.now();
      const groq = new Groq({ apiKey: groqKey });
      const testModel = "qwen/qwen3.8-27b";
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: "Ping" }],
        model: testModel,
        max_tokens: 5,
      });
      const latencyMs = Date.now() - startTime;
      if (completion.choices?.[0]?.message) {
        result.groq = {
          status: "connected",
          model: testModel,
          latencyMs,
          message: "Groq AI connected and operational"
        };
      }
    } catch (err: any) {
      result.groq = {
        status: "error",
        message: err.message || "Failed to communicate with Groq"
      };
    }
  }

  // 2. Test Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    result.supabase = { status: "error", message: "Supabase environment keys are missing" };
  } else {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.from("Nivara").select("*").limit(1);
      
      if (!error) {
        result.supabase = {
          status: "connected",
          url: supabaseUrl,
          message: "Supabase database connected and authenticated"
        };
      } else {
        // Even if table has RLS or specific schema, auth check
        const { error: authErr } = await supabase.auth.getSession();
        if (!authErr) {
          result.supabase = {
            status: "connected",
            url: supabaseUrl,
            message: `Supabase authenticated successfully (${error.message})`
          };
        } else {
          result.supabase = {
            status: "error",
            url: supabaseUrl,
            message: error.message
          };
        }
      }
    } catch (err: any) {
      result.supabase = {
        status: "error",
        url: supabaseUrl,
        message: err.message || "Failed to connect to Supabase"
      };
    }
  }

  return NextResponse.json(result);
}
