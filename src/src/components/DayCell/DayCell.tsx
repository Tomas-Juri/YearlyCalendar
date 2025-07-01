import { classNames } from "primereact/utils";
import "./DayCell.css";
import { Event, openEditEventModal, openAddEventModal } from "../../redux/eventsSlice";
import { useAppDispatch } from "../../redux/hooks";
import { useState, useRef, useEffect } from "react";

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

  const isSecondHalf =
    hasEvent &&
    props.events.every(
      (event) =>
        event.from.getTime() === date.getTime() && event.fromType == "2nd Half"
    );

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
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
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
        <span className="day-cell-text"> {props.day}</span>
      </div>
      {hasEvent && open && (
        <div
          ref={boxRef}
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white border border-slate-300 rounded shadow px-4 py-2 text-sm text-slate-700 min-w-[14rem] z-50 space-y-1 cursor-pointer"
          style={{ pointerEvents: 'auto' }}
        >
          <button
            className="absolute top-1 right-1 text-slate-400 hover:text-slate-700 text-lg px-1 py-0.5"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            aria-label="Close event info"
            type="button"
          >
            ×
          </button>
          <div className="pt-0">
            {props.events.map(e => (
              <button
                key={e.id}
                className="flex flex-col text-left w-full rounded px-1 py-1"
                onClick={(ev) => {
                  ev.stopPropagation();
                  setOpen(false);
                  dispatch(openEditEventModal(e));
                }}
                type="button"
              >
                <span className="font-semibold">{e.title}</span>
                <span className="text-xs text-slate-500">
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
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white border border-slate-300 rounded shadow px-4 py-2 text-sm text-slate-700 min-w-[10rem] z-50 flex flex-col"
          style={{ pointerEvents: 'auto' }}
        >
          <button
            className="absolute top-1 right-1 text-slate-400 hover:text-slate-700 text-lg px-1 py-0.5"
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
            className="flex items-center font-semibold pl-0 pr-1 py-1 rounded text-slate-700 w-full justify-start"
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
        <div className="absolute z-10 bottom-full left-full text-[0.5rem] flex size-4  bg-blue-900 shadow border border-blue-700 rounded-full items-center justify-center text-white font-bold translate-y-3/4 -translate-x-3/4">
          {eventsCount}
        </div>
      )}
    </div>
  );
};
