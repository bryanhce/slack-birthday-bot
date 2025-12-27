export type BotCommand = {
  userId: string;
  userName: string;
  command: string;
  text: string;
  channelId: string;
};

export type BotPlatform = 'slack' | 'telegram';
