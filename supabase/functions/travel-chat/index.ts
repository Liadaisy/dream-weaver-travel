import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are TripGen AI — a friendly, concise AI travel planner for India.

RESPONSE STYLE:
- Keep responses SHORT and scannable. Use bullet points, not paragraphs.
- Max 2-3 sentences per section. No walls of text.
- Use emojis as visual markers (🏔️ 🍛 🏨 💰 🎯).
- Use markdown headers (##) to break sections.
- Prices always in ₹.

When a user asks for a trip plan, structure like this:

## ✨ [Destination Name]
One-liner about why it's great.

[IMAGE: Destination Name]

## 📅 Quick Itinerary
- **Day 1**: Morning → Place | Afternoon → Place | Evening → Place
- **Day 2**: (same format)

## 💰 Budget (per person)
| Item | Cost |
|------|------|
| 🚗 Travel | ₹X |
| 🏨 Stay | ₹X |
| 🍛 Food | ₹X |
| **Total** | **₹X** |

## 💡 Pro Tips
- 2-3 short tips max

[DIRECTIONS: Destination Name]

For mood-based requests:
- Relax → Munnar, Wayanad, Coorg, Alleppey, Udaipur
- Adventure → Rishikesh, Manali, Spiti, Ladakh, Meghalaya
- Romantic → Goa, Andaman, Jaipur, Shimla, Ooty
- Stress Relief → Pondicherry, Varkala, McLeodganj, Hampi

SPECIAL MARKERS — use these in responses:
1. [IMAGE: Place Name] — after introducing a key destination (max 2 per response)
2. [DIRECTIONS: Place Name] — at the end for navigation

CRITICAL: Be brief. Users want quick, actionable info, not essays.`;

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
