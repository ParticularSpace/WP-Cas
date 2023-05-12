const express = require('express');
const router = express.Router();
const { generateResponse } = require('../../utils/openAIService');

router.post('/chat', async (req, res) => {
  try {
    const message = req.body.message;
    const response = await generateResponse(message);
    res.json({ message: response.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});

module.exports = router;
