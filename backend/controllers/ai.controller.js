import * as aiService from "../services/ai.service.js";

export const getResult = async (req, res) => {
  try {
    const { prompt } = req.query;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt query param is required" });
    }

    const result = await aiService.generateResult(prompt);
    res.send(result);
  } catch (err) {
    console.error("AI error:", err.message);
    res.status(500).send({ message: "Failed generating content" });
  }
};
