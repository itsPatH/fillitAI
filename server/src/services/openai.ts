import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateFromOpenAI(prompt: string) {
  const resp = await client.responses.create({ model: 'gpt-4o-mini', input: prompt, max_output_tokens: 600 });
  const text = resp.output_text || resp.output?.[0]?.content?.[0]?.text || '';
  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch {
    // fallback: wrap plaintext into field_0
    return { field_0: text, field_1: '', field_2: '' };
  }
}
