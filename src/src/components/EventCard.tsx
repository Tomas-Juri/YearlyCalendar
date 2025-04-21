import { Event, openEditEventModal } from "../redux/eventsSlice";
import { distinc } from "../utilities";
import { useAppDispatch } from "../redux/hooks";

type Props = {
  event: Event;
};

export const EventCard = ({ event }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <button
      className="px-5 py-4 snap-start  w-full text-left cursor-pointer hover:bg-slate-50 hover:z-10 transition duration-300"
      onClick={() => dispatch(openEditEventModal(event))}
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
    </button>
  );
};
