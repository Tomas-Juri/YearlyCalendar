import { EventBar } from "./components/EventBar";
import { Calendar } from "./components/Calendar";
import { NewEventModal } from "./components/NewEventModal";
import { EditEventModal } from "./components/EditEventModal";
import { useAppSelector } from "./redux/hooks";
import { isWeekend, eachDayOfInterval, isSameDay } from "date-fns";
import Holidays from "date-holidays";

function App() {
  const events = useAppSelector((state) => state.events);
  const holidays = new Holidays("CZ");

  const holidayDates = new Set(
    holidays.getHolidays(new Date().getFullYear()).map((h) => h.date)
  );

  // Count working days (Mon–Fri, not public holidays)
  const vacationDays = events.reduce((total, event) => {
    if (isSameDay(event.from, event.to) && isWorkingDay(event.from)) {
      return total + event.fromType === "Full Day" ? 1 : 0.5;
    }

    const days = eachDayOfInterval({
      start: event.from,
      end: event.to,
    });

    const workingDays = days.filter(isWorkingDay);

    let count = workingDays.length;
    if (
      workingDays.some((day) => isSameDay(day, event.from)) &&
      event.fromType !== "Full day"
    )
      count -= 0.5;

    if (
      workingDays.some((day) => isSameDay(day, event.to)) &&
      event.toType !== "Full day"
    )
      count -= 0.5;

    return total + count;
  }, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = 2025;

  function isWorkingDay(day: Date) {
    const iso = day.toISOString().split("T")[0];
    return !isWeekend(day) && !holidayDates.has(iso);
  }

  return (
    <div className="h-screen bg-slate-100 text-slate-900 flex">
      <div className="flex flex-col w-full">
        <header className="bg-slate-50 border-b border-slate-300 px-8 py-4">
          <div className="font-semibold tracking-wide">Yearly calendar</div>
        </header>
        <main className="flex flex-grow relative">
          <EventBar />
          <div className="h-full flex flex-col">
            <Calendar year={year} today={today} />
            <div className="px-12 pb-24">
              <div className="">
                <table className="bg-white ">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border border-gray-300 text-center text-gray-700 font-medium">
                        Vacation Available
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-centertext-gray-700 font-medium">
                        Vacation Used
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border border-gray-300 text-center text-gray-700 font-medium">
                        27
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-center text-gray-700 font-medium">
                        {vacationDays}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
      <NewEventModal />
      <EditEventModal />
    </div>
  );
}

export default App;
