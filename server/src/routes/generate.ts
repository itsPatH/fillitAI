import { Router } from 'express';
import type { Request, Response } from 'express';
import { generateFromOpenAI } from '../services/openai.js';

const router = Router();

router.post('/', async (req, res) => {
  const { jobTitle, jobDesc, existingProfileText } = req.body;
  if (!jobTitle && !jobDesc) return res.status(400).send({ error: 'missing context' });

  console.log("Body:", req.body); 

  // Instrucciones claras para la IA
  const systemPrompt = `You are a concise career copywriter. Respond ONLY with a strict JSON object with three keys: "field_0", "field_1", "field_2". Do not include any other text, markdown, or explanations.`;
  
  // Tarea específica
  const userPrompt = `
    Job Title: "${jobTitle}"
    Job Description: "${jobDesc}"
    Existing Profile: "${existingProfileText || ''}"

    Generate content for these fields:
    - "field_0": A short paragraph (40-80 words) explaining why I am a good fit for this specific role.
    - "field_1": A single sentence listing my top 3 skills relevant to the job.
    - "field_2": A very short, one-line professional pitch.
  `;

  try {
    // Pasa ambos prompts
    const answers = await generateFromOpenAI(userPrompt, systemPrompt);

    console.log("AI Response:", answers); 
    return res.json({ answers });
  } catch (err) {
    console.error("AI Error:", err);
    return res.status(500).json({ error: 'ai_error' });
  }
});

export default router;