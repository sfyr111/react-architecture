const path = require('path')

module.exports = {
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/public/' // 要加斜杠，不然热更新会出错
  },
  resolve: {
    extensions: ['.js', '.jsx'] // 忽略后缀
  },
  module: {
    rules: [
      {
        enforce: 'pre', // 编译钱eslint
        test: /.(js|jsx)$/,
        loader: 'eslint-loader',
        exclude: [
          path.resolve(__dirname, '../node_modules')
        ]
      },
      {
        test: /.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      }
    ]
  },
}
