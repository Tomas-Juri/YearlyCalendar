import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useEffect } from "react";
import { openAddEventModal, openEditEventModal } from "../../redux/eventsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { closeSidebar, openSidebar } from "../../redux/sidebarSlice";
import { distinct } from "../../utilities";
import { Button } from "../atoms";

export const SideBar = () => {
  const dispatch = useAppDispatch();
  const { isOpen } = useAppSelector((state) => state.sidebar);
  const events = useAppSelector((state) => state.events.events);
  const sortedEvents = [...events].sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());

  const toggleDrawer = () => {
    dispatch(openSidebar());
  };

  const closeDrawer = () => {
    dispatch(closeSidebar());
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeDrawer();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);
  return (
    <>
      <aside className="relative z-60 border-r border-gray-800 bg-gray-950">
        <button
          className={classNames(
            "flex size-16 cursor-pointer items-center justify-center border-b border-transparent text-gray-200 transition duration-300 hover:border-gray-800",
            "bg-gradient-to-br",
            "hover:from-sky-600 hover:to-sky-700 hover:text-sky-50",
            isOpen ? "from-sky-700 to-sky-800 text-sky-100" : "from-transparent to-transparent",
          )}
          onClick={() => toggleDrawer()}
          title="Open events list"
        >
          <ClipboardDocumentListIcon className="size-6" />
        </button>
      </aside>

      {/* Drawer */}
      <div
        className={`fixed top-[57px] left-[65px] z-50 flex h-[calc(100%-57px)] w-96 max-w-[90vw] transform flex-col border-r border-gray-800 bg-gray-950 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-900 px-4 py-3">
          <h2 className="text-lg font-medium text-slate-200">Events</h2>
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
            }}
          />
        </div>
      </div>
    </>
  );
};
