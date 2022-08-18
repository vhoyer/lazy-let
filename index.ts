type DefDict = { [name: string]: () => any };

interface AutoReturning<V> {
  (arg0: V): AutoReturning<V>;
};

export function lazylet<
  T extends DefDict,
  U extends { [key in keyof T]: any },
>(values: T): U & AutoReturning<T> {
  const createStore: AutoReturning<T> = (overrides) => {
    return lazylet({
      ...values,
      ...overrides,
    });
  };

  Object.entries(values).map(([key, factory]) => {
    Object.defineProperty(createStore, key, {
      enumerable: true,
      configurable: true,
      get() {
        const value = factory()
        Object.defineProperty(createStore, key, { get: () => value });
        return value;
      },
    })
  });

  return createStore as (U & AutoReturning<T>);
};
