import { useState, useEffect } from 'react';
import { Button } from "primereact/button";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { openAddEventModal } from "../redux/eventsSlice";
import { ConfirmPopup } from "primereact/confirmpopup";
import { EventCard } from "./EventCard";

export const EventListDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const events = useAppSelector((state) => state.events.events);
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.from).getTime() - new Date(b.from).getTime()
  );
  const dispatch = useAppDispatch();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };

    if (isDrawerOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen]);

  return (
    <>
      <ConfirmPopup />
      
      {/* Event List Button */}
      <button
        onClick={toggleDrawer}
        className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm font-medium"
        aria-label="Toggle events list"
      >
        Event List
      </button>


      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-96 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Events</h2>
          <button
            onClick={closeDrawer}
            className="p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            aria-label="Close events menu"
          >
            <svg
              className="w-5 h-5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Events List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="divide-y divide-slate-200 rounded-lg overflow-hidden shadow-sm bg-slate-50">
            {sortedEvents.length > 0 ? (
              sortedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="p-6 text-center text-slate-500">
                <svg
                  className="mx-auto h-12 w-12 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-2 text-sm">No events yet</p>
                <p className="text-xs text-slate-400">Click "Add Event" to create your first event</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Event Button */}
        <div className="p-4 border-t border-slate-200">
          <Button
            label="Add Event"
            className="w-full"
            onClick={() => {
              dispatch(openAddEventModal());
              closeDrawer();
            }}
          />
        </div>
      </div>
    </>
  );
};
