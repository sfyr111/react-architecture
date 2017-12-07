const axios = require('axios')
const webpack = require('webpack')
const path = require('path')
const MemoryFs = require('memory-fs') // 在内存上读写文件
const proxy = require('http-proxy-middleware')

const serverRender = require('./server-render')

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
// const Module = module.constructor // hack => module.exports

const NativeModule = require('module')
const vm = require('vm')

// module模块 warp 把代码包裹为 (function (exports, require, module, __filename, __dirname) { ...bundle code }
const getModuleFromString = (bundle, filename) => {
  const m = { exports: {}}
  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}

const mfs = new MemoryFs()

const serverCompiler = webpack(serverConfig) // 启动一个webpack
// compiler
serverCompiler.outputFileSystem = mfs // 把distw文件夹写到内存中而不是dist磁盘上outputFileSytstem 配置fs 读写文件的方式,

let serverBundle
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
  const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m.exports // 模块里丢出来的
})


module.exports = app => {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))
  app.get('*', function (req, res, next) {
    if (!serverBundle) {
      return res.send('waiting for compile, refresh later')
    }
    getTemplate().then(template => {
      return serverRender(serverBundle, template, req, res)
    })
      .catch(next)
  })
}
