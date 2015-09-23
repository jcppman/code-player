var path = require('path');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    index: './index',
    app: './app'
  },
  output: {
    path: path.join(__dirname, 'bundle'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ],
  },

  // dev related
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'www')
  }
};
