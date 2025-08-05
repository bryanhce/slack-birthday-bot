// Left the other fields in the event we might want to use in the future
export type SlackCommand = {
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  // token: string;
  // team_id: string;
  // team_domain: string;
  // channel_id: string;
  // channel_name: string;
  // response_url: string;
  // trigger_id: string;
};

export type Birthday = {
  name: string;
  date: string; // MM-DD format
  user_id: string;
};
