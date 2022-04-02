import { isValid, parse } from "date-fns";

export const parseDate = (string, defaultValue) => {
  try {
    const newLocal = parse(string, "dd/MM", new Date(2022, 1));
    return isValid(newLocal) ? newLocal : defaultValue;
  } catch {
    return defaultValue;
  }
};
