import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { openAddEventModal, openEditEventModal } from "../../redux/eventsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { distinct } from "../../utilities";
import { Button } from "../atoms";

export const SideBar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const events = useAppSelector((state) => state.events.events);
  const sortedEvents = [...events].sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());
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
      if (event.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };

    if (isDrawerOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen]);
  return (
    <>
      <aside className="border-r border-gray-800">
        <button
          className="flex size-16 cursor-pointer items-center justify-center border-b border-transparent text-gray-200 transition duration-300 hover:border-gray-800 hover:bg-sky-800 hover:text-white"
          onClick={() => toggleDrawer()}
          title="Open events list"
        >
          <ClipboardDocumentListIcon className="size-6" />
        </button>
      </aside>

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 flex h-full w-96 max-w-[90vw] transform flex-col bg-gray-950 shadow-2xl transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-900 p-4">
          <h2 className="font-medium text-slate-200">Events</h2>
          <button
            onClick={closeDrawer}
            className="-my-1 cursor-pointer rounded-lg p-1 transition-colors hover:bg-gray-500 focus:ring-2 focus:outline-none"
            aria-label="Close events menu"
          >
            <svg className="h-5 w-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Events List */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-50/5 overflow-hidden">
            {sortedEvents.length > 0 ? (
              sortedEvents.map((event) => (
                <button
                  className="group w-full cursor-pointer snap-start px-6 py-4 text-left transition duration-300 hover:z-10 hover:bg-gray-800"
                  onClick={() => dispatch(openEditEventModal(event))}
                  data-id={event.id}
                  key={event.id}
                >
                  <div className="flex-grow">
                    <h2 className="mb-1 font-medium text-slate-300 transition duration-300 group-hover:text-slate-100">
                      {event.title}
                    </h2>
                    <p className="text-sm font-medium text-slate-400 transition duration-300 group-hover:text-slate-200">
                      {[event.from.toLocaleDateString("cs"), event.to?.toLocaleDateString("cs")]
                        .filter((item) => !!item)
                        .filter(distinct)
                        .join(" - ")}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500">
                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-2 mb-1 text-sm">No events yet</p>
                <p className="text-xs text-slate-400">Click "Add Event" to create your first event</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Event Button */}
        <div className="flex flex-shrink-0 p-4">
          <Button
            variant="primary"
            size="regular"
            text="Add Event"
            fullWidth
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
