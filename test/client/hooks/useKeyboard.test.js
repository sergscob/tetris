import { expect } from 'chai';
import React from 'react';
import { renderHook, cleanup } from '@testing-library/react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from '../../../src/client/reducers';
import useKeyboard from '../../../src/client/hooks/useKeyboard';

const captureMiddleware = (actions) => () => (next) => (action) => {
  actions.push(action);
  return next(action);
};

const buildWrapper = (actions) => {
  const store = createStore(rootReducer, applyMiddleware(captureMiddleware(actions)));
  // eslint-disable-next-line react/prop-types
  return function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  };
};

const fireKey = (key) => {
  window.dispatchEvent(new window.KeyboardEvent('keydown', { key, cancelable: true }));
};

describe('client/hooks/useKeyboard', () => {
  afterEach(cleanup);

  it('dispatches the matching action for each mapped key when enabled', () => {
    const actions = [];
    renderHook(() => useKeyboard(true), { wrapper: buildWrapper(actions) });

    fireKey('ArrowLeft');
    fireKey('ArrowRight');
    fireKey('ArrowUp');
    fireKey('ArrowDown');
    fireKey(' ');

    expect(actions.map((action) => action.type)).to.deep.equal([
      'game/move', 'game/move', 'game/rotate', 'game/softDrop', 'game/hardDrop',
    ]);
  });

  it('ignores unmapped keys', () => {
    const actions = [];
    renderHook(() => useKeyboard(true), { wrapper: buildWrapper(actions) });

    fireKey('a');

    expect(actions).to.deep.equal([]);
  });

  it('does not attach a listener when disabled', () => {
    const actions = [];
    renderHook(() => useKeyboard(false), { wrapper: buildWrapper(actions) });

    fireKey('ArrowLeft');

    expect(actions).to.deep.equal([]);
  });

  it('detaches the listener on unmount', () => {
    const actions = [];
    const { unmount } = renderHook(() => useKeyboard(true), { wrapper: buildWrapper(actions) });
    unmount();

    fireKey('ArrowLeft');

    expect(actions).to.deep.equal([]);
  });
});
