# `@vhoyer/lazy-let`

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vhoyer/lazy-let/ci.yml?label=ci)](https://github.com/vhoyer/lazy-let)
[![bundle size](https://img.shields.io/bundlephobia/min/@vhoyer/lazy-let)](https://bundlephobia.com/package/@vhoyer/lazy-let)
[![npm](https://img.shields.io/npm/dw/@vhoyer/lazy-let?label=npm%20downloads)](https://www.npmjs.com/package/@vhoyer/lazy-let)

An utility for using lazy variables in a BDD test environment with nested `describe`s, and `it`s.

## Installation

```bash
npm install --save-dev @vhoyer/lazy-let
```

## Usage

```javascript
import { describe, it, expect, afterEach } from 'vitest';
import { lazylet } from '@vhoyer/lazy-let';
import { render } from '@testing-library/vue';
import MyFooter from '../my-footer.vue';

describe('dummy test', () => {
  const $0 = lazylet(afterEach, {
    value: () => 1,
    wrapper: () => render(MyFooter, {
      props: $0.props, // defaults to undefined
    }),
  });

  it('renders', () => {
    expect($0.wrapper.container).toMatchSnapshot();
  });

  describe('change props', () => {
    const $1 = $0(beforeEach, {
      props: () => ({ prop: $1.value }),
      propsAlternative: ($) => ({ prop: $.value }),
    });

    it('renders different', () => {
      expect($1.wrapper.container).toMatchSnapshot();
    });
  });
});
```
