import { EventBar } from "./components/EventBar";
import { Calendar } from "./components/Calendar";
import { NewEventModal } from "./components/NewEventModal";
import { EditEventModal } from "./components/EditEventModal";
import { DeleteEventModal } from "./components/DeleteEventModal";
import { useAppSelector } from "./redux/hooks";
import { isWeekend, eachDayOfInterval, isSameDay } from "date-fns";
import Holidays from "date-holidays";

function App() {
  const events = useAppSelector((state) => state.events);
  const holidays = new Holidays("CZ");
  
  const year = 2025;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function isWorkingDay(day: Date) {
    const isHoliday = holidays.isHoliday(day);
    const isPublicHoliday = Array.isArray(isHoliday) && 
      isHoliday.some(h => h.type === 'public');
    return !isWeekend(day) && !isPublicHoliday;
  }

  // Count working days (Mon–Fri, not public holidays) with proper overlap handling
  const vacationDays = (() => {
    const dayMap = new Map();
    
    // Collect all days from all events
    events.forEach(event => {
      const days = eachDayOfInterval({
        start: event.from,
        end: event.to,
      });

      days.forEach(day => {
        if (!isWorkingDay(day)) return; // Skip non-working days
        
        const dayKey = day.toISOString().split('T')[0];
        
        if (!dayMap.has(dayKey)) {
          dayMap.set(dayKey, {
            date: day,
            events: []
          });
        }
        
        dayMap.get(dayKey).events.push(event);
      });
    });

    // Calculate vacation days for each unique working day
    let totalVacationDays = 0;
    
    for (const dayInfo of dayMap.values()) {
      const { date, events: dayEvents } = dayInfo;
      let dayVacationDays = 0;
      
      // Find the maximum vacation requirement for this day (overlaps don't count multiple times)
      for (const event of dayEvents) {
        let eventDayVacation = 1; // Default full day
        
        // Single day event
        if (isSameDay(event.from, event.to)) {
          eventDayVacation = event.fromType === "Full day" ? 1 : 0.5;
        } else {
          // Multi-day event - check for half-day types
          if (isSameDay(event.from, date) && event.fromType !== "Full day") {
            eventDayVacation = 0.5;
          } else if (isSameDay(event.to, date) && event.toType !== "Full day") {
            eventDayVacation = 0.5;
          }
        }
        
        // Take maximum (overlaps don't count multiple times)
        dayVacationDays = Math.max(dayVacationDays, eventDayVacation);
      }
      
      totalVacationDays += dayVacationDays;
    }
    
    return totalVacationDays;
  })();

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
      <DeleteEventModal />
    </div>
  );
}

export default App;
