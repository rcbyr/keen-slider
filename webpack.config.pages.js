const path = require('path')
const config = require('./webpack.config.js')
module.exports = {
  ...config,
  devtool: 'source-map',
  mode: 'production',
  output: {
    filename: 'keen-slider.bundle.js',
    path: path.resolve(__dirname, '.', '.gh-pages'),
    libraryTarget: 'umd',
  },
}
