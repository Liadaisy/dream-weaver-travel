import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are WanderAI — an enthusiastic, knowledgeable AI travel planner specializing in Indian travel destinations.

Your personality: Warm, helpful, like a well-traveled friend who knows India inside out.

When a user asks for trip planning, ALWAYS provide:
1. **Destination Overview** — Why this place is perfect for them
2. **Day-by-Day Itinerary** — Structured with Day 1, Day 2, etc.
   - Morning, afternoon, evening activities
   - Specific places to visit with brief descriptions
3. **Where to Stay** — 2-3 hotel/homestay options with price ranges in ₹
4. **Budget Breakdown** — Clear table with:
   - 🚗 Travel cost
   - 🏨 Accommodation
   - 🍛 Food
   - 🎯 Activities
   - 💰 Total estimated budget
5. **Pro Tips** — Hidden gems, best time to visit, what to pack

For mood-based requests:
- Relax → Munnar, Wayanad, Coorg, Alleppey, Udaipur
- Adventure → Rishikesh, Manali, Spiti, Ladakh, Meghalaya
- Romantic → Goa, Andaman, Jaipur, Shimla, Ooty
- Stress Relief → Pondicherry, Varkala, McLeodganj, Hampi

Always use emojis sparingly for warmth. Format with markdown headers and bullet points.
Keep responses detailed but not overwhelming. Use ₹ for all prices.
If budget is mentioned, strictly optimize within that budget.
For group types (solo/couple/friends/family), adjust recommendations accordingly.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
