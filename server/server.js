const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const { Configuration, OpenAIApi } = require("openai");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3006", credentials: true }));
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generatePersonaAndRespond(question, role) {
  try {
    const messages = [
      { role: "system", content: role },
      { role: "user", content: question },
    ];
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    const answer = response.data.choices[0].message.content.trim();
    return answer;
  } catch (e) {
    console.log(e);
    return "Error: Communication error with ChatGPT.";
  }
}

app.post("/", async (req, res) => {
  const { gender, age, country, industry } = req.body;
  console.log(req.body);
  const question = `Create a persona for me based on my information: ${gender}, ${age}, ${country}, ${industry} 한글로 100자 이내로 답변해줘`;
  const role = "You are a persona generator. Provide a persona based on the user's information. 한글로 100자 이내로 답변해줘";
  try {
    const answer = await generatePersonaAndRespond(question, role);
    console.log(answer);
    res.status(200).send({
      answer: answer,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      answer: "An error occurred while generating the persona.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
