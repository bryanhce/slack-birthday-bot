import { WebClient } from '@slack/web-api';

import logger from '../../logger/logger';
import ENV from '../../env';

const client = new WebClient(ENV.SLACK_BOT_TOKEN);

async function sendSlackMessage(text: string, channelId: string) {
  try {
    await client.chat.postMessage({
      channel: channelId,
      text,
    });
  } catch (error) {
    logger.setContext({ channelId });
    logger.error('Error sending slack message:', error);
    throw error;
  }
}

export default sendSlackMessage;
