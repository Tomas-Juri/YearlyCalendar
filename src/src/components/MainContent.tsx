import { Calendar } from "./Calendar";
import { VacationSummary } from "./VacationSummary";
import { EventListDrawer } from "./EventListDrawer";
import { useAppSelector } from "../redux/hooks";
import { Event } from "../redux/eventsSlice";

export const MainContent = () => {
  const eventsState = useAppSelector((state) => state.events);
  const events = eventsState.events;
  const selectedYear = eventsState.selectedYear;
  
  const year = selectedYear;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Filter events for the selected year
  const yearEvents = events.filter((event: Event) => 
    event.from.getFullYear() === year || event.to.getFullYear() === year
  );

  return (
    <main className="flex flex-grow relative">
      <div className="h-full flex flex-col w-full">
        <Calendar year={year} today={today} events={yearEvents} />
        <VacationSummary />
      </div>
      
      {/* Floating Event List Button */}
      <div className="fixed bottom-6 left-6 z-30">
        <EventListDrawer />
      </div>
    </main>
  );
};
