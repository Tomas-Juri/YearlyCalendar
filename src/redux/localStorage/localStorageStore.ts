import { EventsState } from "../eventsSlice";
import { RootState } from "../store";
import { migrations } from "./migrations";

type LocalStorageState = {
  version: number;
  state: RootState;
};

const CURRENT_VERSION = 1;

// convert object to string and store in localStorage
export function saveToLocalStorage(state: RootState) {
  try {
    const localStorageState: LocalStorageState = {
      version: CURRENT_VERSION,
      state: state,
    };
    const serialisedState = JSON.stringify(localStorageState);
    localStorage.setItem("state", serialisedState);
  } catch (exception) {
    console.warn("Unable to write state to local storage", exception);
  }
}

// load string from localStarage and convert into an Object
// invalid output must be undefined
export function loadFromLocalStorage(): { events: EventsState } | undefined {
  try {
    const serialisedState = localStorage.getItem("state");
    if (serialisedState === null) return undefined;
    const localStorageState = JSON.parse(serialisedState, reviver);

    applyMigrations(localStorageState.state);

    return localStorageState.state;
  } catch (exception) {
    console.warn("Unable to get state from local storage", exception);

    return undefined;
  }
}

const isIsoDate = (value: string) =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value);

function reviver(_key: string, value: unknown) {
  if (typeof value === "string" && isIsoDate(value)) {
    return new Date(value);
  }

  return value;
}

function applyMigrations(state: object): object {
  const migrationsToApply = migrations
    .filter((migration) => migration.version > CURRENT_VERSION)
    .sort((a, b) => a.version - b.version);

  if (migrationsToApply.length === 0) {
    console.log("No migrations to apply");
    return state;
  }

  console.log(`Running migrations: ${migrationsToApply.map((m) => m.version).join(", ")}`);

  let migratedState = { ...state };
  for (const migration of migrationsToApply) {
    console.log(`Applying migration version ${migration.version}`);
    migratedState = migration.migrate(state);
  }

  // Here you can implement migration logic if needed
  // For now, we just return the state as is
  return migratedState;
}
