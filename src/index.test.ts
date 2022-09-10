import { lazylet } from './index';

test('lazylet defines variables', () => {
  const $ = lazylet({
    var1: () => 'abc',
  });

  expect($.var1).toEqual('abc');
});

test('lazylet defines lazy variables', () => {
  const var1 = jest.fn(() => 'abcd');

  const $ = lazylet({ var1 });

  expect(var1).not.toHaveBeenCalled();
  $.var1;
  expect(var1).toHaveBeenCalled();
})

test('lazylet does not call factory twice', () => {
  const var1 = jest.fn(() => 'abcd');

  const $ = lazylet({ var1 });

  expect(var1).not.toHaveBeenCalled();
  $.var1;
  expect(var1).toHaveBeenCalledTimes(1);
  $.var1;
  expect(var1).toHaveBeenCalledTimes(1);
})

test('lazylet can use keys inside keys', () => {
  const $ = lazylet({
    var1: () => 'abc',
    var2: () => $.var1 + 'def',
  });

  expect($.var2).toEqual('abcdef');
})

test('lazylet can receive the store on the factory', () => {
  let $ = lazylet({
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
  let $ = lazylet({
    var1: () => 'abc',
    var2: () => $.var1 + 'def',
  });

  expect($.var2).toEqual('abcdef');

  $ = $({
    var1: () => 'cebola_',
  });

  expect($.var2).toEqual('cebola_def');
})
