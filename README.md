# test-lazy-let

An utility for using lazy variables in a BDD test environment with nested `describe`s, and `it`s.

```javascript
import { lazylet } from '@vhoyer/lazy-let';
import { render } from '@testing-library/vue';
import MyFooter from '../my-footer.vue';

describe('dummy test', () => {
  const $0 = lazylet(beforeEach);

  $0.$let('value', () => 1);

  $0.$let('wrapper', () => render(MyFooter, {
    props: $0.props, // defaults to `undefined`
  }));

  it('renders', () => {
    expect($0.wrapper.container).toMatchSnapshot();
  });

  describe('change props', () => {
    const $1 = lazylet(beforeEach, $0);

    $1.$let('props', () => ({ prop: $1.value }));

    it('renders different', () => {
      expect($1.wrapper.container).toMatchSnapshot();
    });
  });
});
```
