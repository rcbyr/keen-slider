import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default {
  input: './src/keen-slider.js',
  output: [
    {
      format: 'es',
      name: 'KeenSlider',
      strict: true,
      // banner,
      sourcemap: true,
      file: './dist/keen-slider.esm.js',
      sourcemap: true,
    },
    {
      format: 'umd',
      name: 'KeenSlider',
      strict: true,
      sourcemap: true,
      file: './dist/keen-slider.min.js',
      format: 'umd',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    babel({
      include: ['*keen-slider.min.js'],
      babelrc: false,
      presets: [
        [
          '@babel/env',
          {
            targets: 'last 2 versions, ie >= 10',
            modules: false,
          },
        ],
      ],
    }),
    terser({}),
  ],
}
