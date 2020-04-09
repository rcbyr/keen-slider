const path = require('path')

module.exports = {
  entry: ['./src/keen-slider.js'],
  devtool: 'source-map',
  mode: 'production',
  output: {
    filename: 'keen-slider.min.js',
    path: path.resolve(__dirname, '.', 'dist'),
    libraryTarget: 'umd',
    globalObject: 'this',
    library: 'KeenSlider',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'entry',
                targets: 'last 2 versions, ie >= 10',
                modules: false,
              },
            ],
          ],
        },
      },
    ],
  },
}
