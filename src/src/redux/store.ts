import { configureStore } from "@reduxjs/toolkit";
import { eventsSlice } from "./eventsSlice";

const isIsoDate = (value: string) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value);

function reviver(_key: string, value: unknown) {
  if (typeof value === "string" && isIsoDate(value)) {
    return new Date(value);
  }

  return value;
}

// convert object to string and store in localStorage
function saveToLocalStorage(state: RootState) {
  try {
    const serialisedState = JSON.stringify(state);
    localStorage.setItem("state", serialisedState);
  } catch (exception) {
    console.warn("Unable to write state to local storage", exception);
  }
}

// load string from localStarage and convert into an Object
// invalid output must be undefined
function loadFromLocalStorage() {
  try {
    const serialisedState = localStorage.getItem("state");
    if (serialisedState === null) return undefined;
    return JSON.parse(serialisedState, reviver);
  } catch (exception) {
    console.warn("Unable to get state from local storage", exception);
    return undefined;
  }
}

export const store = configureStore({
  reducer: eventsSlice.reducer,
  preloadedState: loadFromLocalStorage(),
});

// listen for store changes and use saveToLocalStorage to
// save them to localStorage
store.subscribe(() => saveToLocalStorage(store.getState()));

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
