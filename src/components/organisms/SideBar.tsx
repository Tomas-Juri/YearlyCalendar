import { ClipboardDocumentListIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useEffect } from "react";
import { openAddEventModal, openEditEventModal } from "../../redux/eventsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { closeSidebar, hidePastEvents, openSidebar, showPastEvents } from "../../redux/sidebarSlice";
import { distinct } from "../../utilities";
import { Button } from "../atoms";

export const SideBar = () => {
  const dispatch = useAppDispatch();
  const { isOpen, isPastEventsVisible } = useAppSelector((state) => state.sidebar);
  const events = useAppSelector((state) => state.events.events);

  const sortedEvents = [...events].sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());
  const pastEvents = isPastEventsVisible ? sortedEvents.filter((event) => event.from < new Date()) : [];
  const futureEvents = sortedEvents.filter((event) => event.from >= new Date());

  const openDrawer = () => {
    dispatch(openSidebar());

    const upcomingEvents = document.getElementById("upcoming-events");
    if (upcomingEvents) {
      upcomingEvents.scrollIntoView({ behavior: "smooth" });
    }
  };

  const closeDrawer = () => {
    dispatch(closeSidebar());
  };

  const togglePastEvents = () => {
    if (isPastEventsVisible) {
      dispatch(hidePastEvents());
    } else {
      dispatch(showPastEvents());
    }
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
            "flex size-12 cursor-pointer items-center justify-center border-b border-transparent text-gray-200 transition duration-300 hover:border-gray-800 xl:size-14 2xl:size-16",
            "bg-gradient-to-br",
            "hover:from-sky-600 hover:to-sky-700 hover:text-sky-50",
            isOpen ? "from-sky-700 to-sky-800 text-sky-100" : "from-transparent to-transparent",
          )}
          onClick={() => {
            if (isOpen) closeDrawer();
            else openDrawer();
          }}
          title="Open events list"
        >
          <ClipboardDocumentListIcon className="size-6" />
        </button>
      </aside>

      {/* Drawer */}
      <div
        className={`fixed top-[57px] left-[49px] z-50 flex h-[calc(100%-57px)] w-96 max-w-[90vw] transform flex-col border-r border-gray-800 bg-gray-950 shadow-2xl transition-transform duration-300 ease-in-out xl:left-[57px] 2xl:left-[65px] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-900 px-4 py-3">
          <h2 className="text-lg font-medium text-gray-100">Events</h2>
        </div>

        {/* Events List */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-50/5 overflow-hidden" id="events-list">
            {sortedEvents.length > 0 ? (
              <>
                <div
                  className="flex flex-shrink-0 items-center justify-between border-y border-gray-900 bg-black/10 px-6 py-3"
                  id="upcoming-events"
                >
                  <h2 className="font-medium text-gray-100">Past events</h2>
                  <button
                    className="-my-1 -mr-3 flex size-8 cursor-pointer items-center justify-center rounded-sm text-gray-100 transition duration-300 hover:bg-gray-800 hover:text-white"
                    onClick={() => togglePastEvents()}
                    title={isPastEventsVisible ? "Hide past events" : "Show past events"}
                  >
                    <EyeIcon
                      className={classNames(
                        "size-5 transition duration-300",
                        isPastEventsVisible ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <EyeSlashIcon
                      className={classNames(
                        "absolute size-5 transition duration-300",
                        isPastEventsVisible ? "opacity-0" : "opacity-100",
                      )}
                    />
                  </button>
                </div>
                {pastEvents.map((event) => (
                  <button
                    className="group w-full cursor-pointer snap-start px-6 py-4 text-left transition duration-300 hover:z-10 hover:bg-gray-800"
                    onClick={() => dispatch(openEditEventModal(event))}
                    data-id={event.id}
                    key={event.id}
                  >
                    <div className="flex-grow">
                      <h2 className="mb-1 font-medium text-gray-200 transition duration-300 group-hover:text-gray-100">
                        {event.title}
                      </h2>
                      <p className="text-sm font-medium text-gray-400 transition duration-300 group-hover:text-gray-200">
                        {[event.from.toLocaleDateString("cs"), event.to?.toLocaleDateString("cs")]
                          .filter((item) => !!item)
                          .filter(distinct)
                          .join(" - ")}
                      </p>
                    </div>
                  </button>
                ))}
                <div
                  className="flex flex-shrink-0 items-center justify-between border-y border-gray-900 bg-black/10 px-6 py-3"
                  id="upcoming-events"
                >
                  <h2 className="font-medium text-gray-100">Upcoming events</h2>
                </div>
                {futureEvents.map((event) => (
                  <button
                    className="group w-full cursor-pointer snap-start px-6 py-4 text-left transition duration-300 hover:z-10 hover:bg-gray-800"
                    onClick={() => dispatch(openEditEventModal(event))}
                    data-id={event.id}
                    key={event.id}
                  >
                    <div className="flex-grow">
                      <h2 className="mb-1 text-gray-200 transition duration-300 group-hover:text-gray-100">
                        {event.title}
                      </h2>
                      <p className="text-sm font-light text-gray-400 transition duration-300 group-hover:text-gray-200">
                        {[event.from.toLocaleDateString("cs"), event.to?.toLocaleDateString("cs")]
                          .filter((item) => !!item)
                          .filter(distinct)
                          .join(" - ")}
                      </p>
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-2 mb-1 text-sm">No events yet</p>
                <p className="text-xs text-gray-400">Click "Add Event" to create your first event</p>
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
