export function createSuccessResponse(message: string) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      response_type: "ephermeral", //TODO check what is this ephermeral
      message,
    }),
  };
}

export function createErrorResponse(message: string) {
  return {
    statusCode: 200, // TODO check y isit 200
    body: JSON.stringify({
      response_type: "ephemeral",
      text: `❌ ${message}`,
    }),
  };
}
