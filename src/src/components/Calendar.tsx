import Holidays from "date-holidays";
import { DayCell } from "./DayCell/DayCell";
import { useAppSelector } from "../redux/hooks";
import { Event } from "../redux/eventsSlice";

type Props = {
  year: number;
  today: Date;
};

export const Calendar = ({ year, today }: Props) => {
  const events = useAppSelector((state) => state.events);
  const holidays = new Holidays("CZ");

  const months = Array.from({ length: 12 }, (_, i) => i + 1); // [1, 2, ..., 12]

  const headerLength = Math.max(
    ...months.map((month) => {
      const firstDay = new Date(year, month - 1, 1); // JS months are 0-based
      const dayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)

      // Match C# offset logic where Monday is 0 and Sunday is 6
      const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      // Get number of days in the month
      const daysInMonth = new Date(year, month, 0).getDate();

      return offset + daysInMonth;
    })
  );

  const headerDays = Array.from({ length: headerLength }, (_, x) => {
    const dayOfWeekIndex = x % 7;
    switch (dayOfWeekIndex) {
      case 0:
        return "Monday";
      case 1:
        return "Tuesday";
      case 2:
        return "Wednesday";
      case 3:
        return "Thursday";
      case 4:
        return "Friday";
      case 5:
        return "Saturday";
      case 6:
        return "Sunday";
      default:
        throw new RangeError("Invalid day index");
    }
  });

  const monthModels = months.map((month) => {
    const daysInMonth = new Date(year, month, 0).getDate(); // gets last day of the month
    const firstDay = new Date(year, month - 1, 1);
    const dayOfWeek = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return {
      month: month,
      offset, // number of leading empty cells
      days, // actual days of the month
    };
  });

  const monthName = (month: number) =>
    new Date(year, month - 1).toLocaleString("en-US", { month: "long" });

  function getEventsForDay(
    events: Event[],
    month: number,
    day: number
  ): Event[] {
    const date = new Date(year, month - 1, day);

    return events.filter((event) => {
      return event.from <= date && date <= event.to;
    });
  }

  function hasHoliday(month: number, day: number): boolean {
    const isHoliday = holidays.isHoliday(new Date(year, month - 1, day));
    return (
      Array.isArray(isHoliday) &&
      isHoliday.filter(
        (holiday) =>
          holiday.type === "bank" ||
          holiday.type === "public" ||
          holiday.type === "school"
      ).length > 0
    );
  }

  return (
    <div className="flex-grow flex flex-col px-6 justify-center overflow-x-auto">
      <div className="flex gap-1 mb-1 w-fit">
        <div>
          <div className="h-9 w-16 font-medium items-center justify-center flex border-2 rounded-xs opacity-0 pointer-events-none" />
        </div>
        {headerDays.map((day, i) => (
          <div key={i}>
            <div className="size-9 font-medium items-center justify-center flex border-2 rounded-xs border-slate-300 bg-slate-200 text-slate-700">
              {day.substring(0, 2)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1 w-fit">
        {monthModels.map((month) => (
          <div key={month.month} className="flex gap-1">
            <div>
              <div className="flex-1 h-9 w-16 font-medium items-center justify-center flex border-2 rounded-xs border-slate-300 bg-slate-200">
                {monthName(month.month).substring(0, 3)}
              </div>
            </div>
            {Array.from({ length: month.offset }).map((_, i) => (
              <div key={i}>
                <div className="flex-1 size-9 font-medium items-center justify-center flex border-2 rounded-xs opacity-0 pointer-events-none" />
              </div>
            ))}
            {month.days.map((day) => (
              <DayCell
                key={`${year}-${month}-${day}`}
                year={year}
                month={month.month}
                day={day}
                events={getEventsForDay(events, month.month, day)}
                hasHoliday={hasHoliday(month.month, day)}
                today={today}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
