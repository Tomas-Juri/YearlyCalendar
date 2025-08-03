import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { Event, openAddEventModal, openEditEventModal } from "../../redux/eventsSlice";
import { useAppDispatch } from "../../redux/hooks";
import { DayType } from "../../types";
import "./DayCell.css";

type Props = {
  year: number;
  month: number;
  day: number;
  events: Event[];
  hasHoliday: boolean;
  today: Date;
};

export const DayCell = (props: Props) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const plusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open && !plusOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (open && boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
      if (plusOpen && plusRef.current && !plusRef.current.contains(event.target as Node)) {
        setPlusOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, plusOpen]);

  const date = new Date(props.year, props.month - 1, props.day); // JS months are 0-based
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  const eventsCount = props.events.length;

  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const hasEvent = eventsCount > 0;
  const isHoliday = props.hasHoliday;
  const isPastDay = props.today > date;
  const isToday = props.today.getTime() === date.getTime();

  // Nová logika pro určení typu dne podle pozice v eventu
  function getDayTypeForEvent(event: Event, date: Date): DayType {
    if (event.from.getTime() === date.getTime()) {
      return event.fromType;
    } else if (event.to.getTime() === date.getTime()) {
      return event.toType;
    } else {
      return "Full day";
    }
  }

  // Pokud je na dni více eventů, zobrazíme "nejvýraznější" typ (Full day > půlden)
  const dayTypes = props.events.map((event) => getDayTypeForEvent(event, date));
  const isSecondHalf = dayTypes.length > 0 && dayTypes.every((type) => type === "2nd Half");
  const isFirstHalf = dayTypes.length > 0 && dayTypes.every((type) => type === "1st Half");
  const isFullDay =
    dayTypes.length > 0 &&
    (dayTypes.some((type) => type === "Full day") ||
      (dayTypes.some((type) => type === "2nd Half") && dayTypes.some((type) => type === "1st Half")));

  return (
    <div className="relative select-none">
      <div
        className={classNames(`day-cell`, {
          "has-event": hasEvent,
          "is-weekend": isWeekend,
          "is-holiday": isHoliday,
          "is-past-day": isPastDay,
          "is-today": isToday,
          "is-second-half": isSecondHalf,
          "is-first-half": isFirstHalf,
          "is-full-day": isFullDay,
        })}
        onClick={() => {
          if (hasEvent) {
            setOpen((v) => !v);
            setPlusOpen(false);
          } else {
            setPlusOpen((v) => !v);
            setOpen(false);
          }
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            if (hasEvent) {
              setOpen((v) => !v);
              setPlusOpen(false);
            } else {
              setPlusOpen((v) => !v);
              setOpen(false);
            }
          }
        }}
        aria-haspopup="dialog"
        aria-expanded={open || plusOpen}
      >
        {isSecondHalf && <div className="day-cell-second-half" />}
        {isFirstHalf && <div className="day-cell-first-half" />}
        <span className="day-cell-text"> {props.day}</span>
      </div>
      {hasEvent && open && (
        <div
          ref={boxRef}
          className="absolute top-full left-1/2 z-50 mt-2 min-w-[14rem] -translate-x-1/2 cursor-pointer space-y-1 rounded-sm border-2 border-gray-700 bg-gray-800 text-sm text-gray-200 shadow"
          style={{ pointerEvents: "auto" }}
        >
          <button
            className="absolute top-1 right-1 px-1 py-0.5 text-lg text-gray-300 hover:text-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            aria-label="Close event info"
            type="button"
          >
            ×
          </button>
          <div className="divide-y divide-white/5">
            {props.events.map((e) => (
              <button
                key={e.id}
                className="group flex w-full cursor-pointer flex-col rounded px-4 py-2.5 text-left"
                onClick={(ev) => {
                  ev.stopPropagation();
                  setOpen(false);
                  dispatch(openEditEventModal(e));
                }}
                type="button"
              >
                <span className="max-w-[11rem] truncate font-semibold text-gray-200 transition duration-300 group-hover:text-gray-50">
                  {e.title}
                </span>
                <span className="text-xs text-gray-300 transition duration-300 group-hover:text-gray-100">
                  {e.from.toLocaleDateString("cs")} - {e.to?.toLocaleDateString("cs")}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      {!hasEvent && plusOpen && (
        <div
          ref={plusRef}
          className="mt-0.5s absolute top-full left-1/2 z-50 flex min-w-[10rem] -translate-x-1/2 flex-col rounded border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-700 shadow"
          style={{ pointerEvents: "auto" }}
        >
          <button
            className="absolute top-1 right-1 px-1 py-0.5 text-lg text-gray-300 hover:text-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              setPlusOpen(false);
            }}
            aria-label="Close add event box"
            type="button"
          >
            ×
          </button>
          <button
            className="flex w-full cursor-pointer items-center justify-start gap-3 rounded py-1 pr-1 pl-0 font-medium text-gray-200 transition duration-300 hover:text-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              setPlusOpen(false);
              dispatch(openAddEventModal(date));
            }}
            type="button"
            aria-label="Add event"
          >
            <span className="text-xl leading-none">＋</span>
            <span>Add event</span>
          </button>
        </div>
      )}
      {eventsCount > 1 && (
        <div className="absolute bottom-full left-full z-10 flex size-4 -translate-x-3/4 translate-y-3/4 items-center justify-center rounded-full border border-sky-700 bg-sky-900 text-[0.5rem] font-bold text-white shadow">
          {eventsCount}
        </div>
      )}
    </div>
  );
};
