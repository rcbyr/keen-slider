if (!Math.sign) {
  Math.sign = function (x) {
    return (x > 0) - (x < 0) || +x
  }
}
