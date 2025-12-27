export function createSuccessResponse(message: string) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      method: 'sendMessage',
      result: {
        text: message,
      },
    }),
  };
}

export function createErrorResponse(message: string) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: false,
      error_code: 400,
      description: `❌ ${message}`,
    }),
  };
}
