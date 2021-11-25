import { SliderInstance } from '../core/types'
import { getProp } from '../core/utils'
import {
  HOOK_DESTROYED,
  HOOK_OPTIONS_CHANGED,
  HOOK_UPDATED,
  RendererOptions,
  WebInstance,
  WebOptions,
} from './types'

export default function Renderer(
  slider: SliderInstance<
    WebOptions<{}> & RendererOptions,
    WebInstance<{}>,
    HOOK_DESTROYED | HOOK_OPTIONS_CHANGED | HOOK_UPDATED
  >
): void {
  let elements
  let autoScale = null

  function applyStylesInAnimationFrame(remove?, scale?) {
    slider.animator.active
      ? applyStyles(remove, scale)
      : requestAnimationFrame(() => applyStyles(remove, scale))
  }

  function applyStylesHook() {
    applyStylesInAnimationFrame()
  }

  function applyStyles(remove?, scale?) {
    let sizeSum = 0
    const size = slider.size
    const details = slider.track.details
    if (!details || !elements) return
    const slides = details.slides
    elements.forEach((element, idx) => {
      if (remove) {
        if (!autoScale && scale) scaleElement(element, null)
        positionElement(element, null)
      } else {
        if (!slides[idx]) return
        const slideSize = slides[idx].size * size
        if (!autoScale && scale) scaleElement(element, slideSize)
        positionElement(element, slides[idx].distance * size - sizeSum)
        sizeSum += slideSize
      }
    })
  }

  function scaleElement(element, value) {
    const type = isVertical() ? 'height' : 'width'
    if (value !== null) value += 'px'
    element.style['min-' + type] = value
    element.style['max-' + type] = value
  }

  function positionElement(element, value) {
    if (value !== null) {
      const vertical = isVertical()
      if (slider.options.renderMode === 'performance') value = Math.round(value)
      const x = vertical ? 0 : value
      const y = vertical ? value : 0
      value = `translate3d(${x}px, ${y}px, 0)`
    }
    element.style.transform = value
    element.style['-webkit-transform'] = value
  }

  function isVertical() {
    return slider.options.vertical
  }

  function reset() {
    if (elements) applyStylesInAnimationFrame(true, true)
    slider.on('detailsChanged', applyStylesHook, true)
  }

  function positionAndScale() {
    applyStylesInAnimationFrame(false, true)
  }

  function update() {
    reset()
    if (slider.options.disabled) return
    autoScale = getProp(slider.options.slides, 'perView', null) === 'auto'
    slider.on('detailsChanged', applyStylesHook)
    elements = slider.slides
    if (!elements.length) return
    positionAndScale()
  }

  slider.on('created', update)
  slider.on('optionsChanged', update)
  slider.on('updated', positionAndScale)
  slider.on('destroyed', reset)
}
