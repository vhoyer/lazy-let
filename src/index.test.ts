import { lazylet } from './index';

test('lazylet defines variables', () => {
  const reset = (fn: Function) => fn();
  const $0 = lazylet(reset);
  $0.$let('var1', () => 'abc');

  expect($0.var1).toEqual('abc');
});

test('lazylet defines lazy variables', () => {
  const reset = (fn: Function) => fn();
  const var1 = jest.fn(() => 'abcd');

  const $0 = lazylet(reset);
  $0.$let('var1', var1);

  expect(var1).not.toHaveBeenCalled();
  $0.var1;
  expect(var1).toHaveBeenCalled();
});

test('lazylet does not call factory twice', () => {
  const reset = (fn: Function) => fn();
  const var1 = jest.fn(() => 'abcd');

  const $0 = lazylet(reset);
  $0.$let('var1', var1);

  expect(var1).not.toHaveBeenCalled();
  $0.var1;
  expect(var1).toHaveBeenCalledTimes(1);
  $0.var1;
  expect(var1).toHaveBeenCalledTimes(1);
});

test('lazylet can use keys inside keys', () => {
  const reset = (fn: Function) => fn();
  const $0 = lazylet(reset);
  $0.$let('var1', () => 'abc');
  $0.$let('var2', () => $0.var1 + 'def');

  expect($0.var2).toEqual('abcdef');
});

test('lazylet can receive the store on the factory', () => {
  const reset = (fn: Function) => fn();
  const $0 = lazylet(reset);
  $0.$let('var1', () => 'abc');
  $0.$let('var2', () => $0.var1 + 'def');

  expect($0.var2).toEqual('abcdef');

  const $1 = lazylet(reset, $0);
  $1.$let('var1', () => 'cebola_');

  expect($1.var2).toEqual('cebola_def');
  // this tests the var2 typing
  expect($1.var2.toUpperCase()).toEqual('CEBOLA_DEF');
});
