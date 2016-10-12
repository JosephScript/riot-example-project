var HtmlWebpackPlugin = require('html-webpack-plugin')
var webpack = require('webpack')

module.exports = {
  context: __dirname + '/src',
  entry: [
    './app.js'
  ],
  output: {
    filename: 'app.js',
    path: __dirname + '/dist'
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
    preLoaders: [
      { test: /\.js$|\.tag$/,
        exclude: /node_modules/,
        loader: 'riotjs-loader',
        query: { type: 'none' }
      }
    ],
    loaders: [
      {
        test: /\.js$|\.tag$/,
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
