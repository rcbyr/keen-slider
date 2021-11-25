module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { targets: '>1%, not dead, ie >= 10', modules: false },
    ],
  ],
}
