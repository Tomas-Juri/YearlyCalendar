export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type DayType = "Full day" | "1st Half" | "2nd Half";

export const DayTypes: DayType[] = ["Full day", "1st Half", "2nd Half"];
