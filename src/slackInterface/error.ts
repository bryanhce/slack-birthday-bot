class SlackVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SlackVerificationError';
  }
}

export default SlackVerificationError;
