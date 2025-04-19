import { useRef } from "react";
import { Event } from "../redux/eventsSlice";
import { Menu } from "primereact/menu";
import { distinc } from "../utilities";

type Props = {
  event: Event;
};

export const EventCard = ({ event }: Props) => {
  const menu = useRef(null);
  const items = [
    {
      items: [
        {
          label: "Edit",
          icon: "pi pi-pencil",
        },
        {
          label: "Delete",
          icon: "pi pi-trash",
        },
      ],
    },
  ];

  return (
    <div className="px-5 py-4 snap-start flex gap-4">
      <div className="flex-grow">
        <h2 className="font-medium mb-1 text-gray-800">{event.title}</h2>
        <p className="text-gray-600 font-medium text-sm">
          {[
            event.from.toLocaleDateString("cs"),
            event.to?.toLocaleDateString("cs"),
          ]
            .filter((item) => !!item)
            .filter(distinc)
            .join(" - ")}
        </p>
      </div>
      <div className="flex justify-end gap-3">
        <Menu
          model={items}
          popup
          ref={menu}
          id={`event_${event.id}_menu`}
          popupAlignment="left"
          pt={{
            submenuHeader: { style: { display: "none" } },

            action: { className: "text-sm px-4 py-2.5 gap-1.5" },
          }}
        />
        <button
          className="size-8 space-x-2.5 rounded-md border border-gray-300 text-gray-700 flex items-center justify-center -mr-1"
          onClick={(event) => menu.current.toggle(event)}
          aria-controls={`event_${event.id}_menu`}
          aria-haspopup
        >
          <span className="pi pi-ellipsis-h text-sm"></span>
        </button>
      </div>
    </div>
  );
};
