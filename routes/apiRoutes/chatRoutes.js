const express = require('express'); 
const router = express.Router(); 
const { generateResponse } = require('../../utils/openAIService'); 

router.post('/chat', async (req, res) => {
  try {
    const message = req.body.message; // Get the message from the request body
    const response = await generateResponse(message); // Generate a response using the generateResponse function
    res.json({ message: response.content }); // Send the response as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});

module.exports = router;