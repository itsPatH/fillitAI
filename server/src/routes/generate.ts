import { Router } from 'express';
import { generateFromOpenAI } from '../services/openai';
const router = Router();

router.post('/', async (req, res) => {
  const { jobTitle, jobDesc, existingProfileText } = req.body;
  if (!jobTitle && !jobDesc) return res.status(400).send({ error: 'missing context' });

  const prompt = `You are a concise career copywriter. Input: jobTitle="${jobTitle}" jobDesc="${jobDesc}" profile="${existingProfileText||''}".
Return strict JSON: {"field_0":"<Why this role — 40-80 words>","field_1":"<Top skills — 1 sentence>","field_2":"<One-line pitch>"}.
Tone: professional, proactive. NO extra keys.`;

  try {
    const answers = await generateFromOpenAI(prompt);
    return res.json({ answers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'ai_error' });
  }
});

export default router;
