type LazyLet<T extends object> =
  T &
  (<U extends object>
    (values: {
      [K in keyof U]: () => U[K]
    }) => LazyLet<T & U>
  );

export function lazylet<T extends object>(values: { [K in keyof T]: (store: LazyLet<T>) => T[K] }) {
  const createStore = ((overrides: any) => {
    return lazylet({
      ...values,
      ...overrides,
    });
  }) as LazyLet<T>;

  (Object.entries(values) as Array<[string, (store: LazyLet<T>) => any]>).map(([key, factory]) => {
    Object.defineProperty(createStore, key, {
      enumerable: true,
      configurable: true,
      get() {
        const value = factory(createStore);
        Object.defineProperty(createStore, key, { get: () => value });
        return value;
      },
    });
  });

  return createStore;
};
