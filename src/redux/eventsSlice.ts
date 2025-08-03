import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DayType } from "../types";
import { guid } from "../utilities";

export type EventsState = {
  events: Event[];
  selectedYear: number;
  addEventModal: {
    opened: boolean;
    prefillDate?: Date;
  };
  editEventModal:
    | {
        opened: true;
        event: Event;
      }
    | { opened: false; event?: never };
};

const initialState: EventsState = {
  events: [],
  selectedYear: new Date().getFullYear(),
  addEventModal: {
    opened: false,
    prefillDate: undefined,
  },
  editEventModal: {
    opened: false,
  },
};

export type Event = {
  id: string;
  title: string;
  description: string;
  from: Date;
  fromType: DayType;
  to: Date;
  toType: DayType;
};

export type NewEvent = Omit<Event, "id">;
export type EditEvent = Omit<Event, "id">;

export const eventsSlice = createSlice({
  name: "events",
  initialState: initialState,
  reducers: {
    openAddEventModal: (state, action: PayloadAction<Date | undefined>) => {
      state.addEventModal.opened = true;
      state.addEventModal.prefillDate = action.payload;
    },
    closeAddEventModal: (state) => {
      state.addEventModal.opened = false;
      state.addEventModal.prefillDate = undefined;
    },
    confirmAddEventModal: (state, action: PayloadAction<NewEvent>) => {
      state.events.push({
        ...action.payload,
        id: guid(),
      });
      state.addEventModal.opened = false;
    },
    openEditEventModal: (state, action: PayloadAction<Event>) => {
      state.editEventModal = { opened: true, event: action.payload };
    },
    closeEditEventModal: (state) => {
      state.editEventModal = { opened: false };
    },
    confirmEditEventModal: (state, action: PayloadAction<EditEvent>) => {
      if (state.editEventModal.opened) {
        const eventId = state.editEventModal.event.id;
        const index = state.events.findIndex((event) => event.id === eventId);
        if (index !== -1) {
          state.events[index] = {
            id: state.editEventModal.event.id,
            ...action.payload,
          };
        }
        state.editEventModal = { opened: false };
      }
    },
    confirmDeleteEvent: (state, action: PayloadAction<Event>) => {
      state.events = state.events.filter((event) => event.id !== action.payload.id);
      state.editEventModal = { opened: false };
    },
    setSelectedYear: (state, action: PayloadAction<number>) => {
      state.selectedYear = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  openAddEventModal,
  closeAddEventModal,
  confirmAddEventModal,
  openEditEventModal,
  closeEditEventModal,
  confirmEditEventModal,
  confirmDeleteEvent,
  setSelectedYear,
} = eventsSlice.actions;
