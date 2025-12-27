import sendBirthdayReminders, { ReminderConfig } from './baseReminder';
import dateToday from './helpers/dateToday';
import { formatBirthtdaysByMonth } from './helpers/formatBirthdayMessage';

const monthlyReminderConfig: ReminderConfig = {
  reminderType: 'monthly',
  getDateArgs: () => ({ month: dateToday().month }),
  formatMessage: formatBirthtdaysByMonth,
  getDateLogString: (args) => `${args.month}`,
};

async function monthlyReminder() {
  return sendBirthdayReminders(monthlyReminderConfig);
}

export default monthlyReminder;
