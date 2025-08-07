import { Birthday } from '../types';

function aggregateByChannel(birthdays: Birthday[]): Record<string, Birthday[]> {
  return birthdays.reduce(
    (acc, bday) => {
      if (!acc[bday.channelId]) {
        acc[bday.channelId] = [];
      }
      acc[bday.channelId].push(bday);
      return acc;
    },
    {} as Record<string, Birthday[]>
  );
}

export default aggregateByChannel;
