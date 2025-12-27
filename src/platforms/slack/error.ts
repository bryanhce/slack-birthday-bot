import PlatformVerificationError from '../error';

class SlackVerificationError extends PlatformVerificationError {
  constructor(message: string) {
    super(message);
    this.name = 'SlackVerificationError';
  }
}

export default SlackVerificationError;
