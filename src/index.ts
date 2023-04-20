export type LazyLet<T extends object> =
  T & (<U extends object>
    (values: {
      [K in keyof U]: (store: any) => U[K]
    }) => LazyLet<T & U>
  );

export function lazylet<T extends object>(
  onReset: Function,
  values: { [K in keyof T]: (store: any) => T[K] },
) {
  const createStore = ((overrides: any) => {
    return lazylet(onReset, {
      ...values,
      ...overrides,
    });
  }) as LazyLet<T>;

  const primeStore = () => {
    for (const key in values) {
      Object.defineProperty(createStore, key, {
        enumerable: true,
        configurable: true,
        get() {
          const value = values[key](createStore);
          Object.defineProperty(createStore, key, { get: () => value });
          return value;
        },
      });
    }
  };

  // on beforeEach
  onReset(primeStore);

  return createStore;
};
