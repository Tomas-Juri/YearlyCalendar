import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";

type Props = {
  value: Date | null;
  onChange: (date: Date) => void;
};

import { endOfMonth, getDate } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { compareDates } from "../../utilities/date";

function getWeeks(month: number, year: number): (Date | null)[][] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);

  // JavaScript's getDay(): Sunday=0 ... Saturday=6
  // Shift to Monday=0 ... Sunday=6 (European format)
  const shiftWeekday = (day: number) => (day + 6) % 7;

  const days: (Date | null)[] = [];

  // Fill in empty days before the first of the month
  const startWeekday = shiftWeekday(firstDayOfMonth.getDay());
  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }

  // Fill in all days of the month
  const numberOfDays = getDate(lastDayOfMonth);
  for (let i = 1; i <= numberOfDays; i++) {
    days.push(new Date(year, month, i));
  }

  // Pad remaining cells to fill the final week (if necessary)
  while (days.length % 7 !== 0) {
    days.push(null);
  }

  // Group into weeks (arrays of 7)
  const rows = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(days.slice(i, i + 7));
  }

  return rows;
}

export const DatePicker = (props: Props) => {
  const today = useMemo(() => new Date(), []);
  const selectedDate = props.value || today;
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const [year, setYear] = useState<number>(selectedDate.getFullYear());
  const [month, setMonth] = useState<number>(selectedDate.getMonth()); // JS months are 0-based
  const [popoverElement, setPopoverElement] = useState<HTMLDivElement | null>();

  const onNextMonthClick = () => {
    const nextMonth = new Date(year, month + 1, 1);
    setMonth(nextMonth.getMonth());
    setYear(nextMonth.getFullYear());
  };

  const onPreviousMonthClick = () => {
    const previousMonth = new Date(year, month - 1, 1);
    setMonth(previousMonth.getMonth());
    setYear(previousMonth.getFullYear());
  };

  useEffect(() => {
    if (props.value) {
      setYear(props.value.getFullYear());
      setMonth(props.value.getMonth());
    } else {
      setYear(today.getFullYear());
      setMonth(today.getMonth());
    }
  }, [props.value, today]);

  const weeks = getWeeks(month, year);
  const monthName = new Date(2000, month).toLocaleDateString("default", { month: "long" });

  const onChange = (date: Date) => {
    props.onChange(date);
    setYear(date.getFullYear());
    setMonth(date.getMonth());
  };

  useEffect(() => {
    if (!popoverElement) {
      setYear(selectedDate.getFullYear());
      setMonth(selectedDate.getMonth());
    }
  }, [popoverElement, selectedDate]);

  return (
    <Popover>
      {({ open, close }) => (
        <>
          <PopoverButton
            className={classNames(
              "relative flex w-full items-center justify-between rounded-sm border-2 bg-gray-800 px-3.5 py-2.5 transition duration-300",
              "focus:border-sky-500 focus:text-gray-100 focus:outline-none",
              "placeholder:text-gray-500",
              open ? "border-sky-500 text-gray-100" : "border-gray-600 text-gray-300",
            )}
          >
            {props.value ? props.value.toLocaleDateString("cs") : "Select a date"}
          </PopoverButton>
          <PopoverPanel
            ref={setPopoverElement}
            transition
            anchor="bottom"
            className="relative z-5002 flex flex-col rounded-sm border-2 border-gray-700 bg-gray-800 shadow-lg shadow-black/30 transition duration-300 [--anchor-gap:--spacing(1)] focus:outline-none data-closed:-translate-y-2 data-closed:opacity-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-gray-700 px-2 py-2">
              <button
                onClick={() => onPreviousMonthClick()}
                className="flex size-8 cursor-pointer items-center justify-center rounded-sm text-gray-200 transition duration-300 hover:bg-white/10 hover:text-white"
              >
                <ChevronLeftIcon className="size-5" />
              </button>
              <div className="text-medium text-gray-200">
                {monthName} {year}
              </div>
              <button
                onClick={() => onNextMonthClick()}
                className="flex size-8 cursor-pointer items-center justify-center rounded-sm text-gray-200 transition duration-300 hover:bg-white/10 hover:text-white"
              >
                <ChevronRightIcon className="size-5" />
              </button>
            </div>

            {/* Days i week */}
            <div className="px-2 py-1">
              <div className="grid grid-cols-7">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="flex h-9 w-11 items-center justify-center text-center text-sm font-semibold text-gray-400"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                {weeks.map((week) => (
                  <div className="grid grid-cols-7 gap-1">
                    {week.map((day) => (
                      <button
                        className={classNames(
                          "flex h-9 w-11 cursor-pointer items-center justify-center rounded-xs border-2 border-transparent text-center text-sm text-gray-200 transition duration-300",

                          day && compareDates(day, selectedDate)
                            ? "bg-sky-700 text-sky-50 hover:bg-sky-600 hover:text-white"
                            : "hover:bg-white/15 hover:text-white",
                        )}
                        disabled={!day}
                        title={day ? day.toLocaleDateString("cs") : "No date"}
                        onClick={() => {
                          onChange(day!);
                          close();
                        }}
                      >
                        {day?.getDate()}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  );
};
