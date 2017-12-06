import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader' // eslint-disable-line
import { BrowserRouter } from 'react-router-dom'
import App from './views/App'

// ReactDOM.hydrate(<App />, document.getElementById('root'))

const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <BrowserRouter>
        <Component />
      </BrowserRouter>
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
