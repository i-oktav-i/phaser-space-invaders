type Entries<T extends {}> = T extends any
  ? T extends infer U
    ? Required<{ [K in keyof U]: [K, U[K]] }>[keyof U][]
    : never
  : never;

export const objectEntries = <T extends {}>(obj: T) =>
  Object.entries(obj) as Entries<T>;

export const objectFromEntries = <K extends string | number, V>(
  entries: [K, V][]
) => Object.fromEntries(entries) as Record<K, V>;

export const randomNumber = (min = 0, max = 100) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
