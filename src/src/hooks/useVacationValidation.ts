import { useAppSelector } from '../redux/hooks';
import { isWeekend, eachDayOfInterval, isSameDay } from 'date-fns';
import Holidays from 'date-holidays';
import { Event } from '../redux/eventsSlice';

export const useVacationValidation = () => {
  const eventsState = useAppSelector((state) => state.events);
  const { events, selectedYear, vacationAllowance } = eventsState;
  const holidays = new Holidays('CZ');

  const currentAllowance = vacationAllowance[selectedYear] || 27;

  function isWorkingDay(day: Date) {
    const isHoliday = holidays.isHoliday(day);
    const isPublicHoliday = Array.isArray(isHoliday) && 
      isHoliday.some(h => h.type === 'public');
    return !isWeekend(day) && !isPublicHoliday;
  }

  function calculateVacationDays(eventsToCalculate: Event[]): number {
    const dayMap = new Map();
    
    eventsToCalculate.forEach(event => {
      const days = eachDayOfInterval({
        start: event.from,
        end: event.to,
      });

      days.forEach(day => {
        if (!isWorkingDay(day)) return;
        
        const dayKey = day.toISOString().split('T')[0];
        
        if (!dayMap.has(dayKey)) {
          dayMap.set(dayKey, {
            date: day,
            events: []
          });
        }
        
        dayMap.get(dayKey).events.push(event);
      });
    });

    let totalVacationDays = 0;
    
    for (const dayInfo of dayMap.values()) {
      const { date, events: dayEvents } = dayInfo;
      let dayVacationDays = 0;
      
      for (const event of dayEvents) {
        let eventDayVacation = 1;
        
        if (isSameDay(event.from, event.to)) {
          eventDayVacation = event.fromType === "Full day" ? 1 : 0.5;
        } else {
          if (isSameDay(event.from, date) && event.fromType !== "Full day") {
            eventDayVacation = 0.5;
          } else if (isSameDay(event.to, date) && event.toType !== "Full day") {
            eventDayVacation = 0.5;
          }
        }
        
        dayVacationDays = Math.max(dayVacationDays, eventDayVacation);
      }
      
      totalVacationDays += dayVacationDays;
    }
    
    return totalVacationDays;
  }

  const yearEvents = events.filter(event => 
    event.from.getFullYear() === selectedYear || event.to.getFullYear() === selectedYear
  );

  const currentVacationDays = calculateVacationDays(yearEvents);
  const remainingDays = currentAllowance - currentVacationDays;

  const validateNewEvent = (from: Date, to: Date, fromType: string, toType: string) => {
    const newEvent: Event = {
      id: 'temp',
      title: 'temp',
      description: 'temp',
      from,
      to,
      fromType: fromType as any,
      toType: toType as any,
    };

    // Calculate total with all existing events + new event (considers overlaps)
    const eventsWithNew = [...yearEvents, newEvent];
    const totalWithNew = calculateVacationDays(eventsWithNew);
    const newVacationDays = totalWithNew - currentVacationDays;
    const willExceedLimit = totalWithNew > currentAllowance;
    const remainingAfter = currentAllowance - totalWithNew;

    return {
      newVacationDays,
      totalAfterAdd: totalWithNew,
      willExceedLimit,
      exceedBy: willExceedLimit ? totalWithNew - currentAllowance : 0,
      remainingAfter,
    };
  };

  const validateEditEvent = (originalEvent: Event, newFrom: Date, newTo: Date, newFromType: string, newToType: string) => {
    const newEvent: Event = {
      id: originalEvent.id, // Keep same ID to properly identify the event
      title: 'temp',
      description: 'temp',
      from: newFrom,
      to: newTo,
      fromType: newFromType as any,
      toType: newToType as any,
    };
    
    // Calculate total without original event
    const eventsWithoutOriginal = yearEvents.filter(e => e.id !== originalEvent.id);
    const totalWithoutOriginal = calculateVacationDays(eventsWithoutOriginal);
    
    // Calculate total with edited event (considers overlaps with other events)
    const eventsWithEdited = [...eventsWithoutOriginal, newEvent];
    const totalWithEdited = calculateVacationDays(eventsWithEdited);
    
    const newVacationDays = totalWithEdited - totalWithoutOriginal;
    const originalVacationDays = currentVacationDays - totalWithoutOriginal;
    const willExceedLimit = totalWithEdited > currentAllowance;
    const remainingAfter = currentAllowance - totalWithEdited;
    
    return {
      newVacationDays,
      originalVacationDays,
      totalAfterEdit: totalWithEdited,
      willExceedLimit,
      exceedBy: willExceedLimit ? totalWithEdited - currentAllowance : 0,
      remainingAfter,
    };
  };

  return {
    currentAllowance,
    currentVacationDays,
    remainingDays,
    validateNewEvent,
    validateEditEvent,
    isOverLimit: remainingDays < 0,
    isNearLimit: remainingDays <= 2 && remainingDays > 0,
  };
};
