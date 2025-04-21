import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { guid } from "../utilities";

export type EventsState = {
  events: Event[];
  addEventModal: {
    opened: boolean;
  };
  editEventModal:
    | {
        opened: true;
        event: Event;
      }
    | { opened: false };
};

const initialState: EventsState = {
  events: [],
  addEventModal: {
    opened: false,
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

export type DayType = "Full day" | "1st Half" | "2nd Half";

export type NewEvent = Omit<Event, "id">;
export type EditEvent = Omit<Event, "id">;

export const eventsSlice = createSlice({
  name: "events",
  initialState: initialState,
  reducers: {
    openAddEventModal: (state) => {
      state.addEventModal.opened = true;
    },
    closeAddEventModal: (state) => {
      state.addEventModal.opened = false;
    },
    confirmAddEventModal: (state, action: PayloadAction<NewEvent>) => {
      state.events.push({
        ...action.payload,
        fromType: "Full day",
        toType: "Full day",
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
      state.events = state.events.filter(
        (event) => event.id !== action.payload.id
      );
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
} = eventsSlice.actions;
