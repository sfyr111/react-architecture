const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const HTMLPlugin = require('html-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../client/app.js')
  },
  output: {
    filename: '[name].[hash].js'
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html')
    })
  ]
})

// npm i webpack-dev-server -D
// localhost:8000/filename
if (isDev) {
  config.entry = {
    app: [
      'react-hot-loader/patch', // react-hot-loader@next 相关
      path.join(__dirname, '../client/app.js')
    ]
  }
  config.devServer = {
    host: '0.0.0.0', // 任何host 访问
    port: 8888,
    contentBase: path.join(__dirname, '../dist'), // 访问的静态文件，要把dist 删了
    hot: true, // react-hot-loader@next 相关
    overlay: {
      errors: true // 错误在浏览器上显示
    },
    publicPath: '/public', // 静态路径
    historyApiFallback: { // 指定404请求返回的文件
      index: '/public/index.html'
    }
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin()) // react-hot-loader@next
}

module.exports = config
