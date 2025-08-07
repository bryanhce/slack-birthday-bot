import { LogLevel, LogContext } from './types';

/* eslint-disable class-methods-use-this */
class Logger {
  private static instance: Logger;

  private context: LogContext = {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setContext(context: LogContext) {
    this.context = { ...this.context, ...context };
  }

  public clearContext() {
    this.context = {};
  }

  public error(message: string, data?: any, error?: Error): void {
    this.log(LogLevel.ERROR, message, data, error);
  }

  public warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  public info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  public debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  private log(
    level: LogLevel,
    message: string,
    data?: any,
    error?: Error
  ): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      context: this.context,
      ...(data && { data }),
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
    };

    /* eslint-disable no-console */
    switch (level) {
      case LogLevel.ERROR:
        console.error(JSON.stringify(logEntry));
        break;
      case LogLevel.WARN:
        console.warn(JSON.stringify(logEntry));
        break;
      case LogLevel.INFO:
        console.info(JSON.stringify(logEntry));
        break;
      case LogLevel.DEBUG:
        console.debug(JSON.stringify(logEntry));
        break;
      default:
        console.log('Should not reach here');
    }
    /* eslint-disable no-console */
  }
}
/* eslint-enable class-methods-use-this */

const logger = Logger.getInstance();
export default logger;
