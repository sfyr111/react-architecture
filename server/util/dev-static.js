const axios = require('axios')
const webpack = require('webpack')
const path = require('path')
const MemoryFs = require('memory-fs') // 在内存上读写文件
const proxy = require('http-proxy-middleware')
const serialize = require('serialize-javascript') // 序列化对象为字符串，stringify？
const ejs = require('ejs')
const asyncBootstrap = require('react-async-bootstrapper').default
const ReactDomServer = require('react-dom/server')

const serverConfig = require('../../build/webpack.config.server')

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

const Module = module.constructor // hack => module.exports

const mfs = new MemoryFs()

const serverCompiler = webpack(serverConfig) // 启动一个webpack
// compiler
serverCompiler.outputFileSystem = mfs // 把distw文件夹写到内存中而不是dist磁盘上outputFileSytstem 配置fs 读写文件的方式,

let serverBundle, createStoreMap
// watch 每次更新都会更新
serverCompiler.watch({}, (err, /* webpack building info */stats) => {
  if (err) throw err
  stats = stats.toJson() // toJson?
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.warn(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8') // stream
  const m = new Module()
  m._compile(bundle, 'server-entry.js') // Module 解析 bundle stream, 指定文件名
  serverBundle = m.exports.default // 模块里丢出来的
  createStoreMap = m.exports.createStoreMap // mobx
})

// 用来同步客户端的store
const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {}) // 直接返回个字典对象
}

module.exports = app => {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))
  app.get('*', function (req, res) {
    getTemplate().then(template => {

      const routerContext = {}
      const stores = createStoreMap()
      const app = serverBundle(stores, routerContext, req.url)

      asyncBootstrap(app).then(() => {
        if (routerContext.url) { // '/' 重定向到 'list' 解决'/' 时的数据渲染
          res.status(302).setHeader('Location', routerContext.url)
          res.end()
          return
        }
        const state = getStoreState(stores)
        const content = ReactDomServer.renderToString(app)

        const html = ejs.render(template, {
          appString: content,
          initialState: serialize(state),
        })

        res.send(html)
        // res.send(template.replace('<!-- app -->', content))
      })
    })
  })
}
