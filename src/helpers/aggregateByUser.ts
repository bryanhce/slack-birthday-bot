import { Birthday } from "../types";

function aggregateByUser(birthdays: Birthday[]) {
  const groupByUser: Record<string, Birthday[]> = birthdays.reduce(
    (acc, bday) => {
      if (!acc[bday.user_id]) {
        acc[bday.user_id] = [];
      }
      acc[bday.user_id].push(bday);
      return acc;
    },
    {} as Record<string, Birthday[]>
  );
  return groupByUser;
}

export default aggregateByUser;
