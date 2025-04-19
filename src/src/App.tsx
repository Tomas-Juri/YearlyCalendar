import { EventBar } from "./components/EventBar";
import { Calendar } from "./components/Calendar";
import { NewEventModal } from "./components/NewEventModal";

export type Event = {
  title: string;
  description: string;
  from: Date;
  to: Date;
};

function App() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = 2025;

  return (
    <div className="h-screen bg-gray-100 text-gray-900 flex">
      <div className="flex flex-col w-full">
        <header className="bg-gray-50 border-b border-gray-300 px-8 py-4">
          <div className="font-semibold tracking-wide">Yearly calendar</div>
        </header>
        <main className="flex flex-grow relative">
          <EventBar />
          <Calendar year={year} today={today} />
        </main>
      </div>
      <NewEventModal />
    </div>
  );
}

export default App;
