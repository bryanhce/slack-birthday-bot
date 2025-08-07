export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

export interface LogContext {
  userId?: string;
  userName?: string;
  command?: string;
  channelId?: string;
}
