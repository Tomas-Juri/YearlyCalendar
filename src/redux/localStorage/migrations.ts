type Migration = {
  version: number;
  migrate: (state: object) => object;
};

export const migrations: Migration[] = [
  {
    version: 2,
    migrate: (state) => {
      // Migration logic for version 2

      return {
        ...state,
        // Example: Add a new property or modify existing ones
        sidebar: {
          isOpen: false, // Ensure sidebar is closed by default
        },
      };
    },
  },
];
