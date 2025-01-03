import axios from 'axios';
import DB from '../DB/db.js';

// let conversationHistory = [];

const summarizeAbstract = async (req, res) => {
    const { abstract } = req.body;

    if (!abstract) {
        return res.status(400).send({ error: 'Abstract is required' });
    }

    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'ThesisX',
            prompt: `Summarize the following abstract:\n${abstract}`,
            stream: false,
        });

        res.send({ summary: response.data.response });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to process the request' });
    }
};


let conversationHistory = [];

const resetConversation = (req, res) => {
  conversationHistory = [];
  res.json({ message: 'Conversation history reset.' });
};

const chat = async (req, res) => {
  const { model, messages, stream, keep_alive } = req.body;

  if (!model || !messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Model and messages are required fields' });
  }

  conversationHistory.push(...messages);

  const userMessage = messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n');
  console.log('User message:', userMessage);

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'ThesisX',
      prompt: userMessage,
      stream: stream || false,
      keep_alive: keep_alive || '5m',
    });

    console.log('Model response:', response.data);
    const assistantMessage = response.data.response || 'No response from model';

    conversationHistory.push({ role: 'assistant', content: assistantMessage });

    res.json({
      id: 'chatcmpl-123',
      object: 'chat.completion',
      created: Date.now(),
      model: 'ThesisX',
      choices: [
        {
          message: {
            role: 'assistant',
            content: assistantMessage,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: userMessage.length,
        completion_tokens: assistantMessage.length,
        total_tokens: userMessage.length + assistantMessage.length,
      },
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};


export {
    summarizeAbstract,
    resetConversation,
    chat
}