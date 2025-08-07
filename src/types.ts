// Left the other fields in the event we might want to use in the future
export type SlackCommand = {
  userId: string;
  userName: string;
  command: string;
  text: string;
  channelId: string;
  // token: string;
  // teamId: string;
  // teamDomain: string;
  // channelName: string;
  // responseUrl: string;
  // triggerId: string;
};

export type Birthday = {
  name: string;
  month: string;
  day: string;
  userId: string;
  userName: string;
  channelId: string;
};
