import { format } from "date-fns";
import { addDays, addWeeks, endOfWeek } from "date-fns/fp";
import { pipe } from "fp-ts/lib/function";

export const formatWeekend = (weekendNumber) => {
  try {
    const firstDay = pipe(
      new Date(2022, 0, 1),
      addWeeks(weekendNumber - 1),
      endOfWeek
    );
    const secondDay = pipe(
      new Date(2022, 0, 1),
      addWeeks(weekendNumber - 1),
      endOfWeek(),
      addDays(1)
    );
    return firstDay.getMonth() === secondDay.getMonth()
      ? `${format(firstDay, "d")}-${format(secondDay, "d MMM")}`
      : `${format(firstDay, "d MMM")} - ${format(secondDay, "d MMM")}`;
  } catch {
    return "Invalid";
  }
};
