const express = require('express')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const session = require('express-session')
const serverRender = require('./util/server-render')
const fs = require('fs')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const app = express()

app.use(bodyParser.json()) // post 发送的数据转化为req.body 上的数据
app.use(bodyParser.urlencoded({ extended: false })) // 表单发送的数据转化为req.body

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false, // 每次请求是否生成一个cookie
  saveUninitialized: false,
  secret: 'react cnode class'
}))

app.use(favicon(path.join(__dirname, '../favicon.ico')))

app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'))

if (!isDev) { // 生产环境ssr
  const serverEntry = require('../dist/server-entry') // 因为server-entry 是export default 出来的
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8')
  // 在webpack.config.js, /public 返回静态文件
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', function (req, res, next) {
    serverRender(serverEntry, template, req, res).catch(next)
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app) // 开发环境下，想怎样就怎样- -
}

// 错误处理函数
app.use(function (error, req, res, next) {
  console.error(error)
  res.status(500).send(error)
})

app.listen(3333, function () {
  console.log('server is listening on 3333')
})
