import { eachDayOfInterval, isSameDay, isWeekend } from "date-fns";
import Holidays from "date-holidays";
import { Event } from "../redux/eventsSlice";
import { useAppSelector } from "../redux/hooks";

export const useVacationValidation = () => {
  const eventsState = useAppSelector((state) => state.events);
  const { events, selectedYear } = eventsState;
  const holidays = new Holidays("CZ");

  function isWorkingDay(day: Date) {
    const isHoliday = holidays.isHoliday(day);
    const isPublicHoliday = Array.isArray(isHoliday) && isHoliday.some((h) => h.type === "public");
    return !isWeekend(day) && !isPublicHoliday;
  }

  function calculateVacationDays(eventsToCalculate: Event[]): number {
    const dayMap = new Map();

    eventsToCalculate.forEach((event) => {
      const days = eachDayOfInterval({
        start: event.from,
        end: event.to,
      });

      days.forEach((day) => {
        if (!isWorkingDay(day)) return;

        const dayKey = day.toISOString().split("T")[0];

        if (!dayMap.has(dayKey)) {
          dayMap.set(dayKey, {
            date: day,
            events: [],
          });
        }

        dayMap.get(dayKey).events.push(event);
      });
    });

    let totalVacationDays = 0;

    for (const dayInfo of dayMap.values()) {
      const { date, events: dayEvents } = dayInfo;
      let dayVacationDays = 0;

      for (const event of dayEvents) {
        let eventDayVacation = 1;

        if (isSameDay(event.from, event.to)) {
          eventDayVacation = event.fromType === "Full day" ? 1 : 0.5;
        } else {
          if (isSameDay(event.from, date) && event.fromType !== "Full day") {
            eventDayVacation = 0.5;
          } else if (isSameDay(event.to, date) && event.toType !== "Full day") {
            eventDayVacation = 0.5;
          }
        }

        dayVacationDays = Math.max(dayVacationDays, eventDayVacation);
      }

      totalVacationDays += dayVacationDays;
    }

    return totalVacationDays;
  }

  const yearEvents = events.filter(
    (event) => event.from.getFullYear() === selectedYear || event.to.getFullYear() === selectedYear,
  );

  const currentVacationDays = calculateVacationDays(yearEvents);

  return {
    currentVacationDays,
  };
};
