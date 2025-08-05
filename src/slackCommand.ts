import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { SlackCommand } from "./types";
import { handleAddCommand } from "./handlers/addCommand";
import { createErrorResponse } from "./responses/responses";

export async function handler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const params = new URLSearchParams(event.body!);
    const command: SlackCommand = {
      user_id: params.get("user_id") || "",
      user_name: params.get("user_name") || "",
      command: params.get("command") || "",
      text: params.get("text") || "",
    };
//     {
//     "token": "f9m7jiJC9H8nhucJ3ahZPnhB",
//     "team_id": "T05BACRUJF4",
//     "team_domain": "bryan-zcp7539",
//     "channel_id": "D098EUA3KT9",
//     "channel_name": "directmessage",
//     "user_id": "U05BP23QQ2D",
//     "user_name": "ho.cheng.en.bryan",
//     "command": "/add",
//     "text": "test #01-01",
//     "response_url": "https://hooks.slack.com/commands/T05BACRUJF4/9323298614880/Dg7WJELMzdmJ7YObC5ZgSXRt",
//     "trigger_id": "9323298614928.5384433970514.d6f79034e88dda58c26a0e5baba09008"
// }
    console.log('bryantest', JSON.stringify(command)) // TODO remove

    switch (command.command) {
        case '/add':
            return await handleAddCommand(command)
        // case '/list':
        //     return await handleListCommand(command)
        // case '/remove':
        //     return await handleRemoveCommand(command)
        default:
            return createErrorResponse('Unknown command')
    }
  } catch (error) {
    console.error('Error in slackCommand:', error)
    return {
        statusCode: 500,
        body: 'Internal Server Error'
    }
  }
}
