// TODO i dont think we need so many fields
export type SlackCommand = {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string;
  text: string;
  response_url: string;
  trigger_id: string;
};

export type Birthday = {
    name: string;
    date: string; // MM-DD format
    user_id: string;
}
