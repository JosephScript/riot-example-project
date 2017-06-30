var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')
var path = require('path')

module.exports = {
  context: path.join(__dirname, '/src'),
  entry: [
    './app.js'
  ],
  output: {
    filename: 'app.js',
    path: path.join(__dirname, '/dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.template.html',
      inject: 'body'
    }),
    new webpack.ProvidePlugin({
      riot: 'riot'
    })
  ],
  module: {
    rules: [
      {
        test: /\.tag$/,
        loader: 'riot-tag-loader',
        enforce: 'pre',
        query: {
          type: 'es6'
        }
      }, {
        test: /\.(js|tag)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.png$/, loader: 'url-loader?limit=100000' },
      { test: /\.jpg$/, loader: 'file-loader' }
    ]
  }
}
