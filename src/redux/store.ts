import { configureStore } from "@reduxjs/toolkit";

import { eventsSlice } from "./eventsSlice";
import { loadFromLocalStorage, saveToLocalStorage } from "./localStorage/localStorageStore";

export const store = configureStore({
  reducer: {
    events: eventsSlice.reducer,
  },
  preloadedState: loadFromLocalStorage(),
});

// listen for store changes and use saveToLocalStorage to
// save them to localStorage
store.subscribe(() => saveToLocalStorage(store.getState()));

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
