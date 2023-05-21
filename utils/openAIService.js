const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.GPT_API,
});
const openai = new OpenAIApi(configuration);

async function generateResponse(userMessage, gameOutcome) {
  try {
    const messages = [
      { role: 'system', content: 'You are a dealer at the Four-leaf Casino' },
      { role: 'system', content: `Game Outcome: ${gameOutcome}` },
      { role: 'system', content: 'You can add coins to your account by clicking on your profile image and selecting wallet' },
      { role: 'system', content: 'You can play a game by clicking on the game you want to play in the game drop down menu on the nav bar' },
      { role: 'system', content: 'You can view your account by clicking on your profile image and selecting account' },
      { role: 'user', content: userMessage },
    ];

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.5,
    });

    console.log('Completion:', completion.data.choices);
    console.log('Generated AI response:', completion.data.choices[0].text);

    return completion.data.choices[0].message.content;
  } catch (err) {
    console.error('Error calling OpenAI API:', err);
    throw err;
  }
}


module.exports = {
  generateResponse,
};
