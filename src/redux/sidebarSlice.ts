import { createSlice } from "@reduxjs/toolkit";

export type SidebarState = {
  isOpen: boolean;
  isPastEventsVisible: boolean;
};

const initialState: SidebarState = {
  isOpen: false,
  isPastEventsVisible: false,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: initialState,
  reducers: {
    openSidebar: (state) => {
      state.isOpen = true;
    },
    closeSidebar: (state) => {
      state.isOpen = false;
    },
    showPastEvents: (state) => {
      state.isPastEventsVisible = true;
    },
    hidePastEvents: (state) => {
      state.isPastEventsVisible = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { openSidebar, closeSidebar, showPastEvents, hidePastEvents } = sidebarSlice.actions;
