import { Event } from "../redux/eventsSlice";
import { useAppSelector } from "../redux/hooks";
import { Calendar } from "./Calendar";

export const MainContent = () => {
  const eventsState = useAppSelector((state) => state.events);
  const events = eventsState.events;
  const selectedYear = eventsState.selectedYear;

  const year = selectedYear;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter events for the selected year
  const yearEvents = events.filter(
    (event: Event) => event.from.getFullYear() === year || event.to.getFullYear() === year,
  );

  return (
    <main className="relative flex flex-grow">
      <Calendar year={year} today={today} events={yearEvents} />
    </main>
  );
};
