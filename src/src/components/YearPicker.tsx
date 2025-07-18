import { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setSelectedYear } from '../redux/eventsSlice';

export const YearPicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedYear = useAppSelector(state => state.events.selectedYear);
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate year range (current year -1 to +2 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - 1 + i);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        setIsOpen(false);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const currentIndex = years.indexOf(selectedYear);
        if (currentIndex > 0) {
          dispatch(setSelectedYear(years[currentIndex - 1]));
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        const currentIndex = years.indexOf(selectedYear);
        if (currentIndex < years.length - 1) {
          dispatch(setSelectedYear(years[currentIndex + 1]));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedYear, years, dispatch]);

  const handleYearSelect = (year: number) => {
    dispatch(setSelectedYear(year));
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select year"
      >
        <span className="font-medium text-slate-700">{selectedYear}</span>
        <svg 
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="py-1" role="listbox">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  year === selectedYear
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
                role="option"
                aria-selected={year === selectedYear}
              >
                {year}
                {year === currentYear && (
                  <span className="ml-2 text-xs text-slate-500">(current)</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
