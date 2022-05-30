// https://stackoverflow.com/questions/37688318/typescript-interface-possible-to-make-one-or-the-other-properties-required
type OnlyType<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: never;
};

export type EitherType<T, U> = OnlyType<T, U> | OnlyType<U, T>;
