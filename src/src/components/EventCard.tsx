import { Event, openEditEventModal, openDeleteEventModal } from "../redux/eventsSlice";
import { distinc } from "../utilities";
import { useAppDispatch } from "../redux/hooks";
import { Button } from "primereact/button";
import { useRef } from "react";

type Props = {
  event: Event;
};

export const EventCard = ({ event }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <div
      className="px-5 py-4 snap-start w-full text-left hover:bg-slate-50 hover:z-10 transition duration-300 flex items-center gap-4"
      data-id={event.id}
    >
      <div className="flex-grow">
        <h2 className="font-medium mb-1 text-slate-800">{event.title}</h2>
        <p className="text-slate-600 font-medium text-sm">
          {[
            event.from.toLocaleDateString("cs"),
            event.to?.toLocaleDateString("cs"),
          ]
            .filter((item) => !!item)
            .filter(distinc)
            .join(" - ")}
        </p>
      </div>
      <Button
        icon="pi pi-pen-to-square"
        className="p-button p-button-sm p-button-primary"
        onClick={() => dispatch(openEditEventModal(event))}
        type="button"
      />
      <Button
        icon="pi pi-trash"
        className="p-button p-button-sm p-button-secondary"
        onClick={() => dispatch(openDeleteEventModal(event))}
        type="button"
        aria-label="Delete"
      />
    </div>
  );
};
