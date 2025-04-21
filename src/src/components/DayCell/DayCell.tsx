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
    <div className="relative">
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
      {eventsCount > 1 && (
        <div className="absolute z-10 bottom-full left-full text-[0.5rem] flex size-4  bg-blue-900 shadow border border-blue-700 rounded-full items-center justify-center text-white font-bold translate-y-3/4 -translate-x-3/4">
          {eventsCount}
        </div>
      )}
    </div>
  );
};
