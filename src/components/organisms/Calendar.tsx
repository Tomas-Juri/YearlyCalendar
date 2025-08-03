import classNames from "classnames";
import Holidays from "date-holidays";
import { useVacationValidation } from "../../hooks/useVacationValidation";
import { Event } from "../../redux/eventsSlice";
import { useAppSelector } from "../../redux/hooks";
import { DayCell } from "../atoms";

export const Calendar = () => {
  const { currentVacationDays: vacationDays } = useVacationValidation();
  const eventsState = useAppSelector((state) => state.events);
  const year = eventsState.selectedYear;

  const events = eventsState.events.filter(
    (event: Event) => event.from.getFullYear() === year || event.to.getFullYear() === year,
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
    }),
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
      isPast: month < today.getMonth() + 1 && year <= today.getFullYear(),
      offset, // number of leading empty cells
      days, // actual days of the month
    };
  });

  const monthName = (month: number) => new Date(year, month - 1).toLocaleString("en-US", { month: "long" });

  function getEventsForDay(events: Event[], month: number, day: number): Event[] {
    const date = new Date(year, month - 1, day);

    return events.filter((event) => {
      return event.from <= date && date <= event.to;
    });
  }

  function hasHoliday(month: number, day: number): boolean {
    const isHoliday = holidays.isHoliday(new Date(year, month - 1, day));
    return (
      Array.isArray(isHoliday) &&
      isHoliday.filter((holiday) => holiday.type === "bank" || holiday.type === "public" || holiday.type === "school")
        .length > 0
    );
  }

  return (
    <main className="flex flex-grow flex-col items-center justify-center overflow-x-auto px-6">
      <div>
        <div className="mb-1 flex w-fit gap-1">
          <div>
            <div className="pointer-events-none flex h-8 w-14 items-center justify-center rounded-xs border-2 font-medium opacity-0 2xl:h-9 2xl:w-16" />
          </div>
          {headerDays.map((day, i) => (
            <div key={i}>
              <div className="flex size-8 items-center justify-center border-2 border-gray-600 bg-gray-800 text-sm font-medium text-gray-200 2xl:size-9 2xl:text-base">
                {day.substring(0, 2)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex w-fit flex-col gap-1">
          {monthModels.map((month) => (
            <div key={month.month} className="flex gap-1">
              <div>
                <div
                  className={classNames(
                    "flex h-8 w-14 flex-1 items-center justify-center border-2 text-sm font-medium 2xl:h-9 2xl:w-16 2xl:text-base",
                    month.isPast
                      ? "border-gray-700 bg-white/8 text-gray-500"
                      : "border-gray-600 bg-gray-800 text-gray-200",
                  )}
                >
                  {monthName(month.month).substring(0, 3)}
                </div>
              </div>
              {Array.from({ length: month.offset }).map((_, i) => (
                <div key={i}>
                  <div className="pointer-events-none flex size-8 flex-1 items-center justify-center border-2 text-sm font-medium opacity-0 2xl:size-9 2xl:text-base" />
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
        <div className="mt-6 flex w-full flex-row items-center justify-between">
          <div className="text-sm">
            <span className="font-medium text-gray-200">Used vacation days:</span>
            <span className="font-bold text-gray-100"> {vacationDays}</span>
          </div>
          <div className="flex gap-6 text-sm">
            <p className="text-gray-300">Click a day to add or edit an event</p>
            <div className="flex flex-row items-center gap-3 text-gray-300">
              {/* Full day */}
              <span className="flex items-center gap-1">
                <span className="inline-block h-4 w-4 rounded-xs border border-sky-500 bg-sky-700 align-middle"></span>
                Full day
              </span>
              {/* 1st Half */}
              <span className="flex items-center gap-1">
                <svg
                  width="16"
                  height="16"
                  className="inline-block border-t border-l border-sky-500 align-middle text-sky-700"
                >
                  <polygon points="0,0 16,0 0,16" fill="currentColor" />
                </svg>
                1st Half
              </span>
              {/* 2nd Half */}
              <span className="flex items-center gap-1">
                <svg
                  width="16"
                  height="16"
                  className="inline-block border-r border-b border-sky-500 align-middle text-sky-700"
                >
                  <polygon points="16,16 16,0 0,16" fill="currentColor" />
                </svg>
                2nd Half
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
