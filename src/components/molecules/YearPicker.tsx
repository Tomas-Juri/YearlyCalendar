import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { setSelectedYear } from "../../redux/eventsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

export const YearPicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedYear = useAppSelector((state) => state.events.selectedYear);
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => 1970 + i);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === "Escape") {
        setIsOpen(false);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const currentIndex = years.indexOf(selectedYear);
        if (currentIndex > 0) {
          dispatch(setSelectedYear(years[currentIndex - 1]));
        }
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        const currentIndex = years.indexOf(selectedYear);
        if (currentIndex < years.length - 1) {
          dispatch(setSelectedYear(years[currentIndex + 1]));
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedYear, years, dispatch]);

  const handleYearSelect = (year: number) => {
    dispatch(setSelectedYear(year));
    setIsOpen(false);
  };

  return (
    <div className="relative h-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="duraion-300 group flex h-full items-center justify-center gap-2 border-l border-gray-900 px-5 py-4 text-gray-200 transition-colors hover:bg-sky-800 focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select year"
      >
        <span className="font-medium transition duration-300 group-hover:text-sky-50">
          Selected year: {selectedYear}
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition duration-300 group-hover:text-sky-100 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-1 max-h-60 w-fit overflow-y-auto rounded-xs border border-gray-700 bg-gray-800 shadow-lg">
          <div className="grid grid-cols-3 gap-1 pr-4 text-sm" role="listbox">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={classNames(
                  "block cursor-pointer border-l-2 px-3 py-2 text-center transition-colors",
                  "text-gray-300 hover:bg-gray-600 hover:text-gray-50",
                  year === selectedYear && "bg-sky-800 font-medium text-sky-100 hover:bg-sky-700 hover:text-sky-50",
                  year === currentYear ? "border-sky-400 hover:border-sky-300" : "border-transparent",
                )}
                role="option"
                aria-selected={year === selectedYear}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
