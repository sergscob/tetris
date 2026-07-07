import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import configureStore from './store'
import App from './components/App'
import './styles.css'

const store = configureStore()
const root = createRoot(document.getElementById('tetris'))

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
