import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { Provider, useStaticRendering } from 'mobx-react'
import App from './views/App'

import { createStoreMap } from './store/store'

// mobx 在ssr 时不会重复渲染
useStaticRendering(true) // 使用静态渲染

// stores 会传入多个 { appStore: xxx }
export default (stores, routerContext, url) => (
  <Provider {...stores}>
    {/* 两个参数: context: 需要今天跳转的信息 url: 当前请求的信息 */}
    <StaticRouter context={routerContext} location={url}>
      <App />
    </StaticRouter>
  </Provider>
)

export { createStoreMap }
