import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

// Hardening function
function sanitize(value: any) {
  return typeof value === "string"
    ? value.replace(/[<>]/g, "").trim()
    : value;
}

export async function generateFromOpenAI(userPrompt: string, systemPrompt?: string) {
  
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: userPrompt });

  const resp = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: messages, 
    max_tokens: 600,
  }); 

  let raw = resp.choices[0]?.message?.content || "";
  raw = raw.replace(/```(?:json)?|```/gi, "").trim();
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const candidate = jsonMatch ? jsonMatch[0] : raw;
  try {
    const parsed = JSON.parse(candidate);
    for (const k in parsed) { parsed[k] = sanitize(parsed[k]); }
    return parsed;
  } catch {
    return { field_0: sanitize(candidate), field_1: "", field_2: "" };
  }
}