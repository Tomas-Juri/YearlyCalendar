import { Button } from "primereact/button";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { openAddEventModal } from "../redux/eventsSlice";
import { ConfirmPopup } from "primereact/confirmpopup";
import { EventCard } from "./EventCard";

export const EventBar = () => {
  const events = useAppSelector((state) => state.events);
  const dispatch = useAppDispatch();

  return (
    <>
      <ConfirmPopup />
      <div className=" min-w-[24rem] max-w-[32rem] flex flex-col max-h-[calc(100vh-57px)]">
        <div className="px-4 flex-1 py-4 overflow-y-scroll ">
          <div className="divide-y divide-gray-200 h-fit rounded-lg overflow-hidden shadow-sm bg-white">
            {events.map((event) => (
              <EventCard event={event} />
            ))}
          </div>
        </div>

        <div className="px-4 pb-6 pt-4 r">
          <Button
            label="Add Event"
            className="w-full"
            onClick={() => dispatch(openAddEventModal())}
          />
        </div>
      </div>
    </>
  );
};
