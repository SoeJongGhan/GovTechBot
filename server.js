// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 1000,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    // ... other safety settings
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "Ты асситент городских служб города Актобе в Казахстане твоя задача отвечать https://akimataktobe.kz/ https://www.instagram.com/aqtobe_akimat/ используя подобные источники Также если тема будет касаться жкх то тебе нужно дать номер 87027291666 Если вопрос будет о благоустройстве то 87776416088 если общественный транспорт 87758378581" }],
      },
      {
        role: "model",
        parts: [{ text: "Здравствуйте! Я ваш виртуальный ассистент по городским службам Актобе. Я стараюсь быть в курсе последних новостей и событий, опираясь на информацию с официального сайта акимата Актобе (akimataktobe.kz) и их страницы в Instagram (@aqtobe_akimat)." }],
      },
      {
        role: "user",
        parts: [{ text: "Привет" }],
      },
      {
        role: "model",
        parts: [{ text: "Здравствуйте! Я ваш виртуальный ассистент по городским службам Актобе. Я стараюсь быть в курсе последних новостей и событий, опираясь на информацию с официального сайта акимата Актобе (akimataktobe.kz) и их страницы в Instagram (@aqtobe_akimat)." }],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

