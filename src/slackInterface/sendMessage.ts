import { WebClient } from '@slack/web-api';
import { logger } from '../logger/logger';

const client = new WebClient(process.env.SLACK_BOT_TOKEN);

async function getChannelId(userId: string): Promise<string | undefined> {
  const dm = await client.conversations.open({ users: userId });
  return dm?.channel?.id;
}

async function sendSlackMessage(text: string, userId: string) {
  try {
    // TODO might need to change dynamoDB table to store channelId and userId?
    const channelId = await getChannelId(userId);
    if (!channelId) {
      logger.error('Unable to open slack channel');
      return;
    }

    await client.chat.postMessage({
      channel: channelId,
      text,
    });
  } catch (error) {
    logger.error('Error sending slack message:', error);
    throw error;
  }
}

export default sendSlackMessage;
