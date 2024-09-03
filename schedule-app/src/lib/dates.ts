import * as dates from "date-fns";

const epoch = new Date("2020-01-01");

export function getColumnCount() {
  return dates.differenceInDays(new Date(), epoch) * 2;
}

export function cellIndexToDate(i: number) {
  return dateToString(dates.addDays(epoch, i));
}

export function dateToCellIndex(date: string) {
  return dates.differenceInDays(stringToDate(date), epoch);
}

export function dateToString(date: Date) {
  return dates.format(date, "yyyy-MM-dd");
}

export function stringToDate(date: string) {
  return dates.parse(date, "yyyy-MM-dd", new Date());
}
