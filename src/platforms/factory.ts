import { BotPlatform } from './types';
import Platform from './platform';
import ENV from '../env';
import SlackPlatform from './slack/platform';
import TelegramPlatform from './telegram/platform';

function createPlatform(channelId?: string): Platform {
  const platform: BotPlatform = ENV.BOT_PLATFORM;
  switch (platform) {
    case 'slack':
      return channelId ? new SlackPlatform(channelId) : new SlackPlatform();
    case 'telegram':
      return channelId
        ? new TelegramPlatform(channelId)
        : new TelegramPlatform();
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

export default createPlatform;
