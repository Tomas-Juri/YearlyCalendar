import Holidays from "date-holidays";

const holidays = new Holidays("CZ");

function isWorkingDay(day) {
  const isHoliday = holidays.isHoliday(day);
  const isPublicHoliday = Array.isArray(isHoliday) && isHoliday.some((h) => h.type === "public");

  const dayOfWeek = day.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  return !isWeekend && !isPublicHoliday;
}

console.log("Holiday detection tests:");

const testDates = [
  { date: new Date(2025, 10, 16), desc: "Sunday detection", expected: false },
  { date: new Date(2025, 10, 17), desc: "Holiday detection", expected: false },
  { date: new Date(2025, 10, 18), desc: "Working day detection", expected: true },
  { date: new Date(2025, 0, 1), desc: "New Year detection", expected: false },
  { date: new Date(2025, 0, 2), desc: "Regular working day", expected: true },
];

let passed = 0;
let failed = 0;

testDates.forEach(({ date, desc, expected }, index) => {
  const result = isWorkingDay(date);
  const testPassed = result === expected;

  console.log(`${index + 1}. ${desc}: ${testPassed ? "✅ PASS" : "❌ FAIL"} (${result}/${expected})`);

  if (testPassed) passed++;
  else failed++;
});

console.log(
  `\nResult: ${passed}/${testDates.length} tests passed (${((passed / testDates.length) * 100).toFixed(1)}%)`,
);

if (failed > 0) {
  process.exit(1);
}
