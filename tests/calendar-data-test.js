import Holidays from "date-holidays";
import { isWeekend, eachDayOfInterval, isSameDay } from "date-fns";

const holidays = new Holidays("CZ");

function isWorkingDay(day) {
  const isHoliday = holidays.isHoliday(day);
  const isPublicHoliday = Array.isArray(isHoliday) && isHoliday.some((h) => h.type === "public");
  return !isWeekend(day) && !isPublicHoliday;
}

// Current vacation calculation implementation
function calculateVacationDays(events) {
  const dayMap = new Map();

  events.forEach((event) => {
    const days = eachDayOfInterval({
      start: event.from,
      end: event.to,
    });

    days.forEach((day) => {
      if (!isWorkingDay(day)) return;

      const dayKey = day.toISOString().split("T")[0];

      if (!dayMap.has(dayKey)) {
        dayMap.set(dayKey, {
          date: day,
          events: [],
          totalVacationDays: 0,
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

// Calendar data from user
const calendarData = [
  {
    id: "e55c4925-0954-4250-958b-357a69023e25",
    title: "event {i + 1}",
    description: "",
    from: "2025-04-25T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-04-25T22:00:00.000Z",
    toType: "Full day",
  },
  {
    id: "79f90480-723b-4660-ba58-21dd6866356b",
    title: "event {i + 1}",
    description: "",
    from: "2025-06-19T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-06-21T22:00:00.000Z",
    toType: "Full day",
  },
  {
    id: "18a5569b-738f-4103-a91f-e01718862180",
    title: "event {i + 1}",
    description: "",
    from: "2025-04-26T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-04-26T22:00:00.000Z",
    toType: "Full day",
  },
  {
    id: "acb88624-e07a-451f-a683-0cfd4aa00f49",
    title: "event {i + 1}",
    description: "",
    from: "2025-05-02T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-05-03T22:00:00.000Z",
    toType: "Full day",
  },
  {
    title: "event {i + 1}",
    description: "",
    from: "2025-05-16T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-05-16T22:00:00.000Z",
    toType: "Full day",
    id: "2cd33200-4906-4d6a-8d24-9eadeecb83c2",
  },
  {
    title: "event {i + 1}",
    description: "",
    from: "2025-05-31T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-05-31T22:00:00.000Z",
    toType: "Full day",
    id: "88af4035-49f8-427c-b402-400fbc5961cd",
  },
  {
    title: "event {i + 1}",
    description: "",
    from: "2025-06-06T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-06-06T22:00:00.000Z",
    toType: "Full day",
    id: "a804be70-9965-42c7-b85e-be85b348732b",
  },
  {
    title: "event {i + 1}",
    description: "",
    from: "2025-06-13T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-06-13T22:00:00.000Z",
    toType: "Full day",
    id: "28c8866f-8bea-42d1-b8d8-40ed8e0b137b",
  },
  {
    id: "03c7c4e6-f4c7-41f6-9bac-5c06c4ebd1b3",
    title: "event {i + 1}",
    description: "",
    from: "2025-08-28T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-08-29T22:00:00.000Z",
    toType: "Full day",
  },
  {
    id: "aaf9dde5-32ff-4215-8edc-cc4975bad342",
    title: "event {i + 1}",
    description: "",
    from: "2025-09-19T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-09-19T22:00:00.000Z",
    toType: "Full day",
  },
  {
    title: "event {i + 1}",
    description: "",
    from: "2025-10-04T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-10-04T22:00:00.000Z",
    toType: "Full day",
    id: "e0173a4e-c6bb-4462-ab39-d9f56e80184a",
  },
  {
    title: "event {i + 1}",
    description: "",
    from: "2025-10-24T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-10-24T22:00:00.000Z",
    toType: "Full day",
    id: "f4321935-9e97-402e-baf4-4c0bda6ff3c6",
  },
  {
    id: "4377f2ba-2aa0-4f97-baff-1596f6bb8e8a",
    title: "event {i + 1}",
    description: "",
    from: "2025-05-24T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-05-24T22:00:00.000Z",
    toType: "Full day",
  },
  {
    id: "db1f6630-d623-4504-b5b2-49825dc0a1f5",
    title: "event {i + 1}",
    description: "",
    from: "2025-07-20T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-07-26T22:00:00.000Z",
    toType: "Full day",
  },
  {
    id: "34e95378-679f-49e8-a367-215ec6da4aa7",
    title: "event {i + 1}",
    description: "",
    from: "2025-08-10T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-08-16T22:00:00.000Z",
    toType: "Full day",
  },
  {
    id: "abb50411-2dcf-4d2b-9c19-88a93e57cd09",
    title: "event {i + 1}",
    description: "",
    from: "2025-12-19T23:00:00.000Z",
    fromType: "Full day",
    to: "2026-01-03T23:00:00.000Z",
    toType: "Full day",
  },
  {
    id: "3dde94cd-acec-4948-b5c2-d9b33268b6e7",
    title: "event {i + 1}",
    description: "",
    from: "2025-05-06T22:00:00.000Z",
    fromType: "1st Half",
    to: "2025-05-06T22:00:00.000Z",
    toType: "1st Half",
  },
  {
    title: "event {i + 1}",
    description: "",
    from: "2025-05-17T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-05-17T22:00:00.000Z",
    toType: "Full day",
    id: "0d72a387-12a3-410b-8b5d-ee20575a6351",
  },
  {
    id: "f1f00935-326f-4efd-8b7a-e5e683fa850d",
    title: "event {i + 1}",
    description: "",
    from: "2025-07-10T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-07-13T22:00:00.000Z",
    toType: "Full day",
  },
  {
    title: "event {i + 1}",
    description: "",
    from: "2025-08-01T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-08-01T22:00:00.000Z",
    toType: "Full day",
    id: "bf0b1757-a8b3-4ad3-bb11-2a22f302f745",
  },
  {
    title: "event {i + 1}",
    description: "",
    from: "2025-07-05T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-07-05T22:00:00.000Z",
    toType: "Full day",
    id: "168e00d6-008d-467e-b5ad-98410b2f96ee",
  },
  {
    title: "event {i + 1}",
    description: "",
    from: "2025-07-04T22:00:00.000Z",
    fromType: "Full day",
    to: "2025-07-04T22:00:00.000Z",
    toType: "Full day",
    id: "ef953513-2ac2-4e27-ac31-5d1e51b6bd17",
  },
];

// Convert data to Date objects
const events = calendarData.map((event) => ({
  ...event,
  from: new Date(event.from),
  to: new Date(event.to),
}));

console.log("Calendar data test:");

const result = calculateVacationDays(events);
const expected = 20.5; // Expected total vacation days
const testPassed = result === expected;

console.log(
  `1. Real calendar data (${events.length} events): ${testPassed ? "✅ PASS" : "❌ FAIL"} (${result}/${expected})`,
);

console.log(`\nResult: ${testPassed ? 1 : 0}/1 tests passed (${testPassed ? 100 : 0}%)`);

if (!testPassed) {
  process.exit(1);
}
