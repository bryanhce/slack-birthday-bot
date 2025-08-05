export function createSuccessResponse(message: string) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      // use "ephemeral" if you want messages to only visible to user who invoked command and no persistence
      response_type: "in_channel", // public and persistent 
      text: message, // slack expects text field in the body
    }),
  };
}

export function createErrorResponse(message: string) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      response_type: "in_channel",
      text: `❌ ${message}`,
    }),
  };
}
