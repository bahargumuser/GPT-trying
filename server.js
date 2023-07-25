const express = require("express");
const bodyParser = require("body-parser");
const { GptCompletion } = require("openai");

const app = express();
const port = 3000;

const gpt = new GptCompletion({
  model: "gpt-3.5-turbo",
});

app.use(bodyParser.json());

app.post("/extract-appointment", async (req, res) => {
  try {
    const message = req.body.message;

    const response = await gpt.complete({
      prompt: `API endpoint that extracts the user intent for a new appointment from a natural language message in Turkish using GPT-4. Extract both relative and absolute time and date.\n\nMessage: "${message}"\n\n`,
      maxTokens: 100,
      temperature: 0.5,
      n: 1,
      stop: "\n",
    });

    const intent = response.choices[0].text.trim();
    const datetimeStr = response.choices[0].text.trim();

    const output = {
      intent: intent,
      datetimeStr: datetimeStr,
    };

    res.json(output);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
