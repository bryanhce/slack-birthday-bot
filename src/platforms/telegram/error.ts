import PlatformVerificationError from '../error';

class TelegramVerificationError extends PlatformVerificationError {
  constructor(message: string) {
    super(message);
    this.name = 'TelegramVerificationError';
  }
}

export default TelegramVerificationError;
