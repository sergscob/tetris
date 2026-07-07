import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import createSocketMiddleware from './middleware/socketMiddleware';
import socket from './socket';

const configureStore = (socketInstance = socket) => createStore(
  rootReducer,
  applyMiddleware(thunk, createSocketMiddleware(socketInstance)),
);

export default configureStore;
