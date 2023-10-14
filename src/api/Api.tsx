import { API_KEY, API_BASE_URL, FIREBASE_FUNCTION_URL } from '../constants/Constants';
import axios from 'axios';


const getBotId = async (): Promise<string | null> => {
  const botId = localStorage.getItem('bot_id');
  // this can be saved and retrieved using cookies but it is not sensitive
  if (botId) {
    return botId;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/bots`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (response.status === 200) {
      const newBotId = response.data.data[0].id;
      localStorage.setItem('bot_id', newBotId);
      return newBotId;
    }

    return null; // Handle this as needed
  } catch (error) {
    console.error('Error fetching bot_id:', error);
    return null; 
  }
};

const createConversation = async (botId: string): Promise<string | null> => {
  const conversationId = localStorage.getItem('conversation_id');
  if (conversationId) {
    return conversationId;
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/conversations`, {
      name: 'chat with CodyAI',
      bot_id: botId,
    }, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      // this can be saved and retrieved using cookies
      const newConversationId = response.data.data.id;
      localStorage.setItem('conversation_id', newConversationId);
      return newConversationId;
    }

    return null;
  } catch (error) {
    console.error('Error creating conversation:', error);
    return null;
  }
};

const sendMessage = async (messageContent: string, conversationId: string): Promise<string | null> => {
  try {
    const requestBody = {
      content: messageContent,
      conversation_id: conversationId,
    };

    const response = await axios.post('https://us-central1-turingtest-71926.cloudfunctions.net/proxyRequest', requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      // Assuming the response from your Firebase Function is the desired URL
      return response.data.stream_url;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
};



async function chatWithCody(messageContent: string): Promise<string | null> {
  const botId = await getBotId();
  if (!botId) {
    return null;
  }

  const conversationId = await createConversation(botId);
  if (!conversationId) {
    return null;
  }
  
  try {
    const response = await sendMessage(messageContent, conversationId);
    if (response) {
      const streamUrl = response;
      return streamUrl;
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }

  return null;
}

export  {
  chatWithCody
};
