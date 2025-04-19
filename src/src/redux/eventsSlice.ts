import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { guid } from "../utilities";

export type EventsState = {
  events: Event[];
  addEventModal: {
    opened: boolean;
  };
};

const initialState: EventsState = {
  events: [],
  addEventModal: {
    opened: false,
  },
};

export type Event = {
  id: string;
  title: string;
  description: string;
  from: Date;
  to: Date;
};

export type NewEvent = {
  title: string;
  description: string;
  from: Date;
  to: Date;
};

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
      state.events.push({ ...action.payload, id: guid() });
      state.addEventModal.opened = false;
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
  confirmDeleteEvent,
} = eventsSlice.actions;
