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

export async function generateFromOpenAI(prompt: string) {
  const resp = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        // You MUST force DeepSeek to output pure JSON manually
        content: `Return ONLY valid JSON. No text. No commentary. 
        JSON for this prompt: ${prompt}`,
      },
    ],
    max_tokens: 600,
    temperature: 0, 
  });

  let raw = resp.choices[0]?.message?.content || "";

  try {
    const parsed = JSON.parse(raw);

    Object.keys(parsed).forEach((key) => {
      parsed[key] = sanitize(parsed[key]);
    });

    return parsed;
  } catch {
    return {
      field_0: sanitize(raw),
      field_1: "",
      field_2: "",
    };
  }
}
