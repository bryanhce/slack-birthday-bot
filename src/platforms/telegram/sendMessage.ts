import axios from 'axios';
import https from 'https';
import logger from '../../logger/logger';
import ENV from '../../env';

const TELEGRAM_API_URL = 'https://api.telegram.org/bot';
const botToken = ENV.TELEGRAM_BOT_TOKEN;

const telegramClient = axios.create({
  baseURL: `${TELEGRAM_API_URL}${botToken}/`,
  timeout: 5000,
  // Enable Keep-Alive to reuse TCP connections across invocations
  httpsAgent: new https.Agent({ keepAlive: true }),
});

async function sendTelegramMessage(text: string, chatId: string) {
  try {
    const response = await telegramClient.post('sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    });

    if (!response.data.ok) {
      throw new Error(
        `Telegram API returned error: ${response.data.description || 'Unknown error'}`
      );
    }
  } catch (error) {
    logger.setContext({ channelId: chatId });
    logger.error('Error sending telegram message:', error);
    throw error;
  }
}

export default sendTelegramMessage;
