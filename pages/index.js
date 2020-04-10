import './style.scss'
import '../src/keen-slider.scss'
import KeenSlider from '../src/keen-slider'

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window
    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this)
    }
  }
}

const c = new KeenSlider('#slider-basic')

new KeenSlider(document.getElementById('slider-with-arrows'), {
  loop: false,
  initialSlide: 1,
  created: function () {
    const slider = this
    document.getElementById('arrow-left').addEventListener('click', function () {
      slider.prev()
    })

    document
      .getElementById('arrow-right')
      .addEventListener('click', function () {
        slider.next()
      })

    const dots = document.querySelectorAll('.dot')
    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        slider.moveToSlide(idx)
      })
    })
  },
  changed: function (idx) {
    const slider = this
    const arrowLeft = document.getElementById('arrow-left')
    const arrowRight = document.getElementById('arrow-right')
    idx === 0
      ? arrowLeft.classList.add('disabled')
      : arrowLeft.classList.remove('disabled')
    idx === slider.length - 1
      ? arrowRight.classList.add('disabled')
      : arrowRight.classList.remove('disabled')

    const dots = document.querySelectorAll('.dot')
    dots.forEach(function (dot, idx) {
      idx === slider.slide
        ? dot.classList.add('active')
        : dot.classList.remove('active')
    })
  },
})

// const autoplay = new KeenSlider(document.getElementById('slider-autoplay'), {
//   controls: false,
// })
// setInterval(autoplay.next, 2000)

// const slider_lazy = document.getElementById('slider-lazy-load')
// const lazy_items = slider_lazy.querySelectorAll('.keen-slider__slide')

// const lazy = new KeenSlider(slider_lazy, {
//   created: function() {
//     loadImage(lazy_items[this.slide])
//   },
//   changed: function(idx) {
//     const _this = this
//     loadImage(lazy_items[idx], function() {
//       _this.refreshLoopSlides()
//     })
//   },
// })

// function loadImage(item, func) {
//   if (!item) return
//   setTimeout(function() {
//     const img = item.querySelector('img')
//     img.setAttribute('src', img.getAttribute('data-src'))
//     if (func) func()
//   }, 500)
// }
