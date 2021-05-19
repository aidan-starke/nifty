import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { MemoryRouter as Router } from 'react-router'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import * as serviceWorker from './serviceWorker'

import App from './components/App'
import theme from './theme'
import store from './store'

document.addEventListener('DOMContentLoaded', () => {
  render(
    <Router>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Provider>
    </Router>,
    document.getElementById('root')
  )
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
