import { createSlice } from "@reduxjs/toolkit";

export type SidebarState = {
  isOpen: boolean;
};

const initialState: SidebarState = {
  isOpen: false,
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
  },
});

// Action creators are generated for each case reducer function
export const { openSidebar, closeSidebar } = sidebarSlice.actions;
