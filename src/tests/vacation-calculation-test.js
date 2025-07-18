import Holidays from 'date-holidays';
import { isWeekend, eachDayOfInterval, isSameDay } from 'date-fns';

const holidays = new Holidays('CZ');

function isWorkingDay(day) {
  const isHoliday = holidays.isHoliday(day);
  const isPublicHoliday = Array.isArray(isHoliday) && 
    isHoliday.some(h => h.type === 'public');
  return !isWeekend(day) && !isPublicHoliday;
}

// Current vacation calculation implementation
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
          events: [],
          totalVacationDays: 0
        });
      }
      
      dayMap.get(dayKey).events.push(event);
    });
  });

  let totalVacationDays = 0;
  
  for (const [dayKey, dayInfo] of dayMap.entries()) {
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
console.log('Vacation calculation tests:');

const testScenarios = [
  {
    name: 'Holiday only',
    events: [{ from: new Date(2025, 10, 17), to: new Date(2025, 10, 17), fromType: "Full day", toType: "Full day" }],
    expected: 0
  },
  {
    name: 'Weekend only',
    events: [{ from: new Date(2025, 10, 16), to: new Date(2025, 10, 17), fromType: "Full day", toType: "Full day" }],
    expected: 0
  },
  {
    name: 'Holiday + working day',
    events: [{ from: new Date(2025, 10, 17), to: new Date(2025, 10, 18), fromType: "Full day", toType: "Full day" }],
    expected: 1
  },
  {
    name: 'Half day vacation',
    events: [{ from: new Date(2025, 10, 18), to: new Date(2025, 10, 18), fromType: "1st Half", toType: "1st Half" }],
    expected: 0.5
  },
  {
    name: 'Week with weekend',
    events: [{ from: new Date(2025, 10, 17), to: new Date(2025, 10, 23), fromType: "Full day", toType: "Full day" }],
    expected: 4
  }
];

let passed = 0;
let failed = 0;

testScenarios.forEach((scenario, index) => {
  const result = calculateVacationDays(scenario.events);
  const testPassed = result === scenario.expected;
  
  console.log(`${index + 1}. ${scenario.name}: ${testPassed ? '✅ PASS' : '❌ FAIL'} (${result}/${scenario.expected})`);
  
  if (testPassed) passed++;
  else failed++;
});

console.log(`\nResult: ${passed}/${testScenarios.length} tests passed (${((passed / testScenarios.length) * 100).toFixed(1)}%)`);

if (failed > 0) {
  process.exit(1);
}
