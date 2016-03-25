var webpack = require('webpack');
var path = require('path');

var PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
  devtool: PROD ? 'inline-source-map' : null,
  entry: [
    'webpack-hot-middleware/client',
    './../client/client.js'
  ],
  output: {
    path: path.resolve('./dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // new webpack.optimize.UglifyJsPlugin({minimize: true})
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/,
          /clientServerExample/,
          /emulatorNode/,
          /ioNode/,
          /presenceNode/,
          /clientServer/
        ],
        query: {
          presets: [
            'react',
            'react-hmre',
            'es2015'
          ]
        }
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }
    ]
  }
};
