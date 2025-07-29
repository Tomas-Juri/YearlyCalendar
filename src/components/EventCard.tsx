import { Event, openEditEventModal } from "../redux/eventsSlice";
import { useAppDispatch } from "../redux/hooks";
import { distinct } from "../utilities";

type Props = {
  event: Event;
};

export const EventCard = ({ event }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <button
      className="w-full cursor-pointer snap-start px-5 py-4 text-left transition duration-300 hover:z-10 hover:bg-slate-50"
      onClick={() => dispatch(openEditEventModal(event))}
      data-id={event.id}
    >
      <div className="flex-grow">
        <h2 className="mb-1 font-medium text-slate-800">{event.title}</h2>
        <p className="text-sm font-medium text-slate-600">
          {[event.from.toLocaleDateString("cs"), event.to?.toLocaleDateString("cs")]
            .filter((item) => !!item)
            .filter(distinct)
            .join(" - ")}
        </p>
      </div>
    </button>
  );
};
