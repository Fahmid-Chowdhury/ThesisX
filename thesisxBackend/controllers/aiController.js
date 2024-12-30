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

const resetConversation = (req, res) => {
    conversationHistory = [];
    res.json({ message: 'Conversation history reset.' });
};


const chat = async (req, res) => {
    const { model, prompt, stream, keep_alive } = req.body;
    const userId = 1;

    if (!prompt || !model) {
        return res.status(400).json({ error: 'Model and prompt are required.' });
    }

    try {
        // Fetch or initialize conversation history
        let chat = await DB.chat.findUnique({
            where: { userId_model: { userId, model } },
        });

        if (!chat) {
            chat = await DB.chat.create({
                data: {
                    userId,
                    model,
                    conversationHistory: [],
                },
            });
        }

        const conversationHistory = chat.conversationHistory || [];

        // Include the latest prompt in the conversation history
        const userMessage = { role: 'user', content: prompt };
        conversationHistory.push(userMessage);

         // Limit conversation history length
         if (conversationHistory.length > MAX_HISTORY_LENGTH) {
            conversationHistory = conversationHistory.slice(-MAX_HISTORY_LENGTH); // Keep only the last MAX_HISTORY_LENGTH messages
        }

        // Send request to AI model
        const aiResponse = await axios.post('http://localhost:11434/api/generate', {
            model,
            prompt: conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join('\n'),
            stream: stream || false,
            keep_alive: keep_alive || '5m',
        });

        const assistantMessage = { role: 'assistant', content: aiResponse.data.response };
        conversationHistory.push(assistantMessage);

        // Save updated conversation history
        await DB.chat.update({
            where: { id: chat.id },
            data: { conversationHistory },
        });

        res.json({
            conversation: conversationHistory,
            response: assistantMessage.content,
        });
    } catch (error) {
        console.error('Error during AI chat:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// const chat = async (req, res) => {
//     const { model, messages, options, stream, keep_alive } = req.body;

//     if (!model || !messages || !Array.isArray(messages)) {
//         return res.status(400).json({ error: 'Model and messages are required fields' });
//     }
    
//     const conversationHistory = chat.conversationHistory || [];

//     // Include the latest prompt in the conversation history
//     const userMessage = { role: 'user', content: messages[0].content };
//     conversationHistory.push(userMessage);
//     console.log('user message:', userMessage); 

//     // conversationHistory.push(...messages);
//     // console.log('Conversation history:', conversationHistory);

//     // const userMessage = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
//     // console.log('User message:', messages);

//     try {
//         const response = await axios.post('http://localhost:11434/api/generate', {
//             model: 'ThesisX',
//             prompt: conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join('\n'),
//             // prompt: userMessage,
//             stream: stream || false,
//             keep_alive: keep_alive || '5m',
//         });

//         // console.log('Model response:', response.data);
//         // const assistantMessage = response.data.response || 'No response from model';
//         // // console.log('Assistant message:', assistantMessage);
//         // conversationHistory.push({ role: 'assistant', content: assistantMessage });
//         // // console.log('Conversation history:', conversationHistory);

//         const assistantMessage = { role: 'assistant', content: response.data.response };
//         conversationHistory.push(assistantMessage);
//         console.log('Conversation history:', conversationHistory);

//         res.json({
//             id: 'chatcmpl-123',
//             object: 'chat.completion',
//             created: Date.now(),
//             model: 'ThesisX',
//             choices: [
//                 {
//                     message: {
//                         role: 'assistant',
//                         content: assistantMessage
//                     },
//                     finish_reason: 'stop'
//                 }
//             ],
//             usage: {
//                 prompt_tokens: userMessage.length,
//                 completion_tokens: assistantMessage.length,
//                 total_tokens: userMessage.length + assistantMessage.length
//             }
//         });
//     } catch (error) {
//         console.error('Error:', error.message);
//         res.status(500).json({ error: error.message });
//     }
// };


export {
    summarizeAbstract,
    resetConversation,
    chat
}