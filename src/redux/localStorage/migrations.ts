type Migration = {
  version: number;
  migrate: (state: object) => object;
};

export const migrations: Migration[] = [];
