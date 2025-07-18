import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setVacationAllowance } from '../redux/eventsSlice';

export const VacationAllowanceEditor = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const selectedYear = useAppSelector(state => state.events.selectedYear);
  const vacationAllowance = useAppSelector(state => state.events.vacationAllowance);
  const dispatch = useAppDispatch();

  const currentAllowance = vacationAllowance[selectedYear] || 27;

  const startEditing = () => {
    setEditValue(currentAllowance.toString());
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditValue('');
  };

  const saveAllowance = () => {
    const newValue = parseInt(editValue, 10);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 365) {
      dispatch(setVacationAllowance({ year: selectedYear, days: newValue }));
      setIsEditing(false);
      setEditValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveAllowance();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-16 px-2 py-1 text-center border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          min="0"
          max="365"
          autoFocus
        />
        <button
          onClick={saveAllowance}
          className="p-1 text-green-600 hover:text-green-700 focus:outline-none"
          title="Save"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
        <button
          onClick={cancelEditing}
          className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none"
          title="Cancel"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-semibold text-slate-700">{currentAllowance}</span>
      <button
        onClick={startEditing}
        className="p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
        title="Edit allowance"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    </div>
  );
};
