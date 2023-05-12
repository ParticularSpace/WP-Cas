const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.GPT_API,
});
const openai = new OpenAIApi(configuration);

async function generateResponse(userMessage, gameOutcome) {
  const messages = [
    { role: 'system', content: 'You are a dealer at the Four-leaf Casino' },
    { role: 'user', content: userMessage },
    { role: 'system', content: `Game Outcome: ${gameOutcome}` } 

  ];

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.5,
  });

  return completion.data.choices[0].message;
}

module.exports = {
  generateResponse,
};
