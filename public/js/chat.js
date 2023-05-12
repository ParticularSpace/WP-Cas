document.querySelector('#chat-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const messageInput = document.querySelector('#chat-message');
  const userMessage = messageInput.value;
  messageInput.value = '';

  // Add user message to the chat window
  const chatMessages = document.querySelector('#chat-messages');
  chatMessages.innerHTML += `<div class="user-message"><strong>You:</strong> ${userMessage}</div>`;

  // Send the message to the server and get the AI response
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userMessage }),
  });

  if (response.ok) {
    const data = await response.json();
    const aiMessage = data.message;

    // Add the AI message to the chat window
    chatMessages.innerHTML += `<div class="ai-message"><strong>AI:</strong> ${aiMessage}</div>`;

    // Scroll to the bottom of the chat window
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } else {
    console.error('Error fetching AI response:', response.status);
  }
});