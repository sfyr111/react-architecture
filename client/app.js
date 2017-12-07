import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader' // eslint-disable-line
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import App from './views/App'

import AppState from './store/app-state'

// ReactDOM.hydrate(<App />, document.getElementById('root'))

const initialState = window.__INTIAL__STATE__ || {} // eslint-disable-line

const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Provider appState={new AppState(initialState.appState)}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root,
  )
}

render(App)

if (module.hot) { // 配置react-hot-loader@next 相关
  module.hot.accept('./views/App', () => {
    // 用的export defalut
    const NextApp = require('./views/App.jsx').default // eslint-disable-line
    // ReactDOM.hydrate(<NextApp />, document.getElementById('root'))
    render(NextApp)
  })
}
