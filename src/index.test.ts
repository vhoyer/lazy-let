import { lazylet } from './index';

test('lazylet defines variables', () => {
  const reset = (fn: Function) => fn();
  const $ = lazylet(reset, {
    var1: () => 'abc',
  });

  expect($.var1).toEqual('abc');
});

test('lazylet defines lazy variables', () => {
  const reset = (fn: Function) => fn();
  const var1 = jest.fn(() => 'abcd');

  const $ = lazylet(reset, { var1 });

  expect(var1).not.toHaveBeenCalled();
  $.var1;
  expect(var1).toHaveBeenCalled();
})

test('lazylet does not call factory twice', () => {
  const reset = (fn: Function) => fn();
  const var1 = jest.fn(() => 'abcd');

  const $ = lazylet(reset, { var1 });

  expect(var1).not.toHaveBeenCalled();
  $.var1;
  expect(var1).toHaveBeenCalledTimes(1);
  $.var1;
  expect(var1).toHaveBeenCalledTimes(1);
})

test('lazylet can use keys inside keys', () => {
  const reset = (fn: Function) => fn();
  const $ = lazylet(reset, {
    var1: () => 'abc',
    var2: () => $.var1 + 'def',
  });

  expect($.var2).toEqual('abcdef');
})

test('lazylet can receive the store on the factory', () => {
  const reset = (fn: Function) => fn();
  let $ = lazylet(reset, {
    var1: () => 'abc',
    var2: ($) => $.var1 + 'def',
  });

  expect($.var2).toEqual('abcdef');

  $ = $({
    var1: () => 'cebola_',
  });

  expect($.var2).toEqual('cebola_def');
  expect($.var2.toUpperCase()).toEqual('CEBOLA_DEF');
})

test('lazylet can be redefined with overrides after instantiated', () => {
  const reset = (fn: Function) => fn();
  let $ = lazylet(reset, {
    var1: () => 'abc',
    var2: () => $.var1 + 'def',
  });

  expect($.var2).toEqual('abcdef');

  $ = $({
    var1: () => 'cebola_',
  });

  expect($.var2).toEqual('cebola_def');
})

test('can be reset between tests', () => {
  let simulateBeforeEach: any;
  const reset = (fn: Function) => simulateBeforeEach = fn;
  const var1 = jest.fn(() => 'abcd');

  const $ = lazylet(reset, { var1 });

  // simulate beforeEach
  simulateBeforeEach?.();

  expect(var1).not.toHaveBeenCalled();
  $.var1;
  expect(var1).toHaveBeenCalledTimes(1);
  $.var1;
  expect(var1).toHaveBeenCalledTimes(1);

  // simulate beforeEach
  simulateBeforeEach?.();

  expect(var1).toHaveBeenCalledTimes(1);
  $.var1;
  expect(var1).toHaveBeenCalledTimes(2);
  $.var1;
  expect(var1).toHaveBeenCalledTimes(2);
});
