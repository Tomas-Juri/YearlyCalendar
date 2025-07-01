import { classNames } from "primereact/utils";
import "./DayCell.css";
import { Event } from "../../redux/eventsSlice";

type Props = {
  year: number;
  month: number;
  day: number;
  events: Event[];
  hasHoliday: boolean;
  today: Date;
};

export const DayCell = (props: Props) => {
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
    <div className="relative group">
      <div
        className={classNames(`day-cell`, {
          "has-event": hasEvent,
          "is-weekend": isWeekend,
          "is-holiday": isHoliday,
          "is-past-day": isPastDay,
          "is-today": isToday,
          "is-second-half": isSecondHalf,
        })}
      >
        <div className="day-cell-second-half"></div>
        <span className="day-cell-text"> {props.day}</span>
      </div>
      {hasEvent && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white border border-slate-300 rounded shadow px-4 py-2 text-sm text-slate-700 min-w-[12rem] z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 space-y-1">
          {props.events.map(e => (
            <div key={e.id} className="flex flex-col">
              <span className="font-semibold">{e.title}</span>
              <span className="text-xs text-slate-500">
                {e.from.toLocaleDateString("cs")} - {e.to?.toLocaleDateString("cs")}
              </span>
            </div>
          ))}
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
