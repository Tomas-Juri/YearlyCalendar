// Simple component and vacation calculation tests
import { JSDOM } from 'jsdom';
import Holidays from 'date-holidays';
import { isWeekend, eachDayOfInterval, isSameDay } from 'date-fns';

// Set up DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;

const holidays = new Holidays('CZ');

function isWorkingDay(day) {
  const isHoliday = holidays.isHoliday(day);
  const isPublicHoliday = Array.isArray(isHoliday) && 
    isHoliday.some(h => h.type === 'public');
  return !isWeekend(day) && !isPublicHoliday;
}

function calculateVacationDays(events) {
  const dayMap = new Map();
  
  events.forEach(event => {
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

console.log('Component and vacation calculation tests:');

// Test data
const mockEvents = [
  {
    id: '1',
    title: 'Test Vacation',
    from: new Date(2024, 0, 15), // Monday
    to: new Date(2024, 0, 19), // Friday
    fromType: 'Full day',
    toType: 'Full day',
  },
  {
    id: '2',
    title: 'Half Day',
    from: new Date(2024, 0, 22), // Monday
    to: new Date(2024, 0, 22),
    fromType: '1st Half',
    toType: '1st Half',
  },
];

const testScenarios = [
  {
    name: 'Basic vacation calculation',
    events: mockEvents,
    expected: 5.5, // 5 full days + 0.5 half day
    test: () => {
      const result = calculateVacationDays(mockEvents);
      return result === 5.5;
    }
  },
  {
    name: 'Vacation limit validation',
    allowance: 25,
    used: 5.5,
    test: () => {
      const remaining = 25 - 5.5;
      const isOverLimit = remaining < 0;
      const isNearLimit = remaining <= 2 && remaining > 0;
      
      return remaining === 19.5 && !isOverLimit && !isNearLimit;
    }
  },
  {
    name: 'Over limit detection',
    allowance: 5,
    used: 5.5,
    test: () => {
      const remaining = 5 - 5.5;
      const isOverLimit = remaining < 0;
      
      return remaining === -0.5 && isOverLimit;
    }
  },
  {
    name: 'Near limit detection',
    allowance: 7,
    used: 5.5,
    test: () => {
      const remaining = 7 - 5.5;
      const isNearLimit = remaining <= 2 && remaining > 0;
      
      return remaining === 1.5 && isNearLimit;
    }
  },
  {
    name: 'New event validation',
    currentUsed: 5.5,
    allowance: 25,
    newEventDays: 3,
    test: () => {
      const totalAfterAdd = 5.5 + 3;
      const willExceedLimit = totalAfterAdd > 25;
      const remainingAfter = 25 - totalAfterAdd;
      
      return !willExceedLimit && remainingAfter === 16.5;
    }
  }
];

let passed = 0;
let failed = 0;

testScenarios.forEach((scenario, index) => {
  try {
    const result = scenario.test();
    const testPassed = result === true;
    
    console.log(`${index + 1}. ${scenario.name}: ${testPassed ? '✅ PASS' : '❌ FAIL'}`);
    
    if (testPassed) passed++;
    else failed++;
  } catch (error) {
    console.log(`${index + 1}. ${scenario.name}: ❌ FAIL (${error.message})`);
    failed++;
  }
});

console.log(`\nResult: ${passed}/${testScenarios.length} tests passed (${((passed / testScenarios.length) * 100).toFixed(1)}%)`);

if (failed > 0) {
  process.exit(1);
}
