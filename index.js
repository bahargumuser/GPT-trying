const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/extract-intent", async (req, res) => {
  const message = req.body.message;

  try {
    const response = await axios.post(
      "https://api.openai.com/v4/engines/davinci-codex/completions",
      {
        prompt: message,
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { choices } = response.data.choices[0];
    let intent = "other";
    let datetimeStr = "";

    for (const choice of choices) {
      if (choice.text.includes("yeni_randevu")) {
        intent = "yeni_randevu";
      } else if (choice.text.includes("T")) {
        datetimeStr = choice.text;
        break;
      }
    }

    const result = {
      intent,
      datetimeStr,
    };

    res.json(result);
  } catch (error) {}
});

app.listen(3000, () => {
  console.log("API server is running on port 3000");
});
