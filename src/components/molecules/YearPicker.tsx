import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import classNames from "classnames";
import { setSelectedYear } from "../../redux/eventsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

export const YearPicker = () => {
  const selectedYear = useAppSelector((state) => state.events.selectedYear);
  const dispatch = useAppDispatch();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => 1970 + i);

  return (
    <div className="relative h-full">
      <Listbox value={selectedYear} onChange={(value) => dispatch(setSelectedYear(value))}>
        <ListboxButton className="group font-mediu flex h-full cursor-pointer items-center justify-center gap-2 border-l border-gray-900 px-5 py-4 text-gray-200 transition-colors duration-300 hover:bg-sky-800 hover:text-sky-50 focus:outline-none">
          Selected year: {selectedYear}
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className={classNames(
            "absolute top-full right-0 z-50 rounded-xs border border-gray-700 bg-gray-800 shadow-lg [--anchor-gap:--spacing(1)] [--anchor-max-height:15rem]",
            "transition duration-100 data-closed:data-closed:opacity-0",
          )}
        >
          {years.map((year) => (
            <ListboxOption
              key={year}
              value={year}
              className={classNames(
                "cursor-pointer border-l-2 px-3 py-2 text-center transition-colors select-none",
                "text-gray-300 hover:bg-gray-600 hover:text-gray-50",
                year === selectedYear &&
                  "bg-sky-800 font-medium text-sky-100 hover:bg-sky-700 hover:text-sky-50 focus:bg-sky-700 focus:text-sky-50",
                year === currentYear ? "border-sky-400 hover:border-sky-300" : "border-transparent",
              )}
            >
              {year}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
};
