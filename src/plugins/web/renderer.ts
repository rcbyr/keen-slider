import { SliderInstance } from '../../core/types'
import { getProp } from '../../core/utils'
import { HOOK_OPTIONS_CHANGED, HOOK_UPDATED } from '../types'
import {
  HOOK_DESTROYED,
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
  let autoScale = null
  let elements
  let verticalOption

  function applyStylesInAnimationFrame(remove?, scale?, vertical?) {
    slider.animator.active
      ? applyStyles(remove, scale, vertical)
      : requestAnimationFrame(() => applyStyles(remove, scale, vertical))
  }

  function applyStylesHook() {
    applyStylesInAnimationFrame(false, false, verticalOption)
  }

  function applyStyles(remove?, scale?, vertical?) {
    let sizeSum = 0
    const size = slider.size
    const details = slider.track.details
    if (!details || !elements) return
    const slides = details.slides
    elements.forEach((element, idx) => {
      if (remove) {
        if (!autoScale && scale) scaleElement(element, null, vertical)
        positionElement(element, null, vertical)
      } else {
        if (!slides[idx]) return
        const slideSize = slides[idx].size * size
        if (!autoScale && scale) scaleElement(element, slideSize, vertical)
        positionElement(
          element,
          slides[idx].distance * size - sizeSum,
          vertical
        )
        sizeSum += slideSize
      }
    })
  }

  function scaleElement(element, value, vertical) {
    const type = vertical ? 'height' : 'width'
    if (value !== null) value += 'px'
    element.style['min-' + type] = value
    element.style['max-' + type] = value
  }

  function positionElement(element, value, vertical) {
    if (value !== null) {
      if (slider.options.renderMode === 'performance') value = Math.round(value)
      const x = vertical ? 0 : value
      const y = vertical ? value : 0
      value = `translate3d(${x}px, ${y}px, 0)`
    }
    element.style.transform = value
    element.style['-webkit-transform'] = value
  }

  function reset() {
    if (elements) applyStylesInAnimationFrame(true, true, verticalOption)
    slider.on('detailsChanged', applyStylesHook, true)
  }

  function positionAndScale() {
    applyStylesInAnimationFrame(false, true, verticalOption)
  }

  function update() {
    reset()
    verticalOption = slider.options.vertical
    if (slider.options.disabled || slider.options.renderMode === 'custom')
      return
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
