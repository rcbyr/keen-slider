import { terser } from 'rollup-plugin-terser'
import babel from '@rollup/plugin-babel'
import autoprefixer from 'autoprefixer'
import copy from 'rollup-plugin-copy'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'

const umd = {
  input: './.build/keen-slider.js',
  output: [
    {
      file: './keen-slider.js',
      format: 'umd',
      name: 'KeenSlider',
      sourcemap: false,
      strict: true,
    },
  ],
  plugins: [resolve(), babel(), terser({ output: { comments: false } })],
}

const cjs = {
  input: './.build/keen-slider.js',
  output: {
    file: './keen-slider.cjs.js',
    format: 'cjs',
    exports: 'named',
  },
  plugins: [resolve(), terser({ output: { comments: false } })],
}

const es = {
  input: './.build/keen-slider.js',
  output: {
    file: './keen-slider.es.js',
    format: 'es',
    exports: 'named',
  },
  plugins: [resolve(), terser({ output: { comments: false } })],
}

const react = {
  input: './.build/react.js',
  output: {
    file: './react.js',
    format: 'cjs',
    exports: 'named',
  },
  external: ['react'],
  plugins: [resolve(), terser({ output: { comments: false } })],
}

const react_es = {
  input: './.build/react.js',
  output: {
    file: './react.es.js',
    format: 'es',
    exports: 'named',
  },
  external: ['react'],
  plugins: [resolve(), terser({ output: { comments: false } })],
}

const vue = {
  input: './.build/vue.js',
  output: {
    file: './vue.js',
    format: 'cjs',
    exports: 'named',
  },
  external: ['vue'],
  plugins: [resolve(), terser({ output: { comments: false } })],
}

const vue_es = {
  input: './.build/vue.js',
  output: {
    file: './vue.es.js',
    format: 'es',
    exports: 'named',
  },
  external: ['vue'],
  plugins: [resolve(), terser({ output: { comments: false } })],
}

const react_native = {
  input: './.build/react-native.js',
  output: {
    file: './react-native.js',
    format: 'es',
    exports: 'named',
  },
  external: ['react', 'react-native'],
  plugins: [resolve(), terser({ output: { comments: false } })],
}

const styles = [
  {
    input: 'src/keen-slider.scss',
    output: {
      file: 'keen-slider.css',
    },
    plugins: [
      copy({
        targets: [{ dest: './', src: './src/keen-slider.scss' }],
      }),
      postcss({
        extract: true,
        plugins: [autoprefixer()],
        sourceMap: false,
      }),
    ],
  },
  {
    input: 'src/keen-slider.scss',
    output: {
      file: 'keen-slider.min.css',
    },
    plugins: [
      postcss({
        extract: true,
        minimize: true,
        plugins: [autoprefixer()],
        sourceMap: false,
      }),
    ],
  },
]

export default [
  umd,
  cjs,
  es,
  react,
  react_es,
  vue,
  vue_es,
  react_native,
  ...styles,
]
