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
  return function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  };
};

const fireKey = (key) => {
  window.dispatchEvent(new window.KeyboardEvent('keydown', { key, cancelable: true }));
};

describe('client/hooks/useKeyboard', () => {
  afterEach(cleanup);

  it('dispatches the matching action for each mapped key when enabled, ignoring unmapped keys', () => {
    const actions = [];
    renderHook(() => useKeyboard(true), { wrapper: buildWrapper(actions) });

    fireKey('ArrowLeft');
    fireKey('ArrowRight');
    fireKey('ArrowUp');
    fireKey('ArrowDown');
    fireKey(' ');
    fireKey('a');

    expect(actions.map((action) => action.type)).to.deep.equal([
      'game/move', 'game/move', 'game/rotate', 'game/softDrop', 'game/hardDrop',
    ]);
  })
  
});
