const express = require('express')
const ReactSSR = require('react-dom/server')
const favicon = require('serve-favicon')
const fs = require('fs')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const app = express()

app.use(favicon(path.join(__dirname, '../favicon.ico')))

if (!isDev) { // 生产环境ssr
  const serverEntry = require('../dist/server-entry').default // 因为server-entry 是export default 出来的
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')
  // 在webpack.config.js, /public 返回静态文件
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', function (req, res) {
    const appString = ReactSSR.renderToString(serverEntry)

    res.send(template.replace('<!-- app -->', appString))
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app) // 开发环境下，想怎样就怎样- -
}

app.listen(3333, function () {
  console.log('server is listening on 3333')
})
