import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { SlackCommand } from "./types";
import { handleAddCommand } from "./handlers/addCommand";
import { createErrorResponse } from "./responses/responses";

export async function commandHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const params = new URLSearchParams(event.body!);
    const command: SlackCommand = {
      token: params.get("token") || "",
      team_id: params.get("team_id") || "",
      team_domain: params.get("team_domain") || "",
      channel_id: params.get("channel_id") || "",
      channel_name: params.get("channel_name") || "",
      user_id: params.get("user_id") || "",
      user_name: params.get("user_name") || "",
      command: params.get("command") || "",
      text: params.get("text") || "",
      response_url: params.get("response_url") || "",
      trigger_id: params.get("trigger_id") || "",
    };

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
