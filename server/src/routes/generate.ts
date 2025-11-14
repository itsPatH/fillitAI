import { Router } from "express";
import { generateFromOpenAI } from "../services/openai.js";

const router = Router();

router.post("/", async (req, res) => {
  console.log("Body:", req.body);

  try {
    const { prompt } = req.body;

    const output = await generateFromOpenAI(prompt);

    return res.json({
      success: true,
      output,
      received: req.body,
    });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({
      success: false,
      error: "AI request failed",
    });
  }
});

export default router;
