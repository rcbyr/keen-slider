import { SliderInstance, SliderPlugin } from '../../core/types'
import {
  dir,
  elem,
  elems,
  Events,
  getProp,
  rect,
  setAttr,
} from '../../core/utils'
import { HOOK_OPTIONS_CHANGED, HOOK_UPDATED } from '../types'
import {
  Container,
  HOOK_BEFORE_OPTIONS_CHANGED,
  HOOK_DESTROYED,
  WebInstance,
  WebOptions,
} from './types'

export default function Web<O>(
  container: Container,
  defaultOptions: O
): SliderPlugin<
  {},
  {},
  | HOOK_OPTIONS_CHANGED
  | HOOK_UPDATED
  | HOOK_DESTROYED
  | HOOK_BEFORE_OPTIONS_CHANGED
> {
  return (
    slider: SliderInstance<
      WebOptions<{}>,
      WebInstance<{}>,
      | HOOK_OPTIONS_CHANGED
      | HOOK_UPDATED
      | HOOK_DESTROYED
      | HOOK_BEFORE_OPTIONS_CHANGED
    >
  ): void => {
    const events = Events()

    let currentMatch, compareSize, options, mediaQueryLists

    function applyAttributes(remove?) {
      setAttr(
        slider.container,
        'reverse',
        dir(slider.container) === 'rtl' && !remove ? '' : null
      )
      setAttr(
        slider.container,
        'v',
        slider.options.vertical && !remove ? '' : null
      )
      setAttr(
        slider.container,
        'disabled',
        slider.options.disabled && !remove ? '' : null
      )
    }

    function breakPointChange() {
      if (!checkBreakpoint()) return
      optionsChanged()
    }

    function checkBreakpoint() {
      let match = null
      mediaQueryLists.forEach(mediaQueryList => {
        if (mediaQueryList.matches) match = mediaQueryList.__media
      })
      if (match === currentMatch) return false
      if (!currentMatch) slider.emit('beforeOptionsChanged')
      currentMatch = match
      const _options = match ? options.breakpoints[match] : options
      slider.options = {
        ...options,
        ..._options,
      }
      applyAttributes()
      updateSize()
      updateSlides()
      renewTrackConfig()
      return true
    }

    function getElementSize(elem) {
      const sizes = rect(elem)
      return (
        (slider.options.vertical ? sizes.height : sizes.width) / slider.size ||
        1
      )
    }

    function getSlidesConfigLength() {
      return slider.options.trackConfig.length
    }

    function init(_options) {
      currentMatch = false
      options = { ...defaultOptions, ..._options }
      events.purge()
      compareSize = slider.size
      mediaQueryLists = []
      for (const value in options.breakpoints || []) {
        const mediaQueryList: MediaQueryList & { __media?: string } =
          window.matchMedia(value)
        mediaQueryList.__media = value
        mediaQueryLists.push(mediaQueryList)
        events.add(mediaQueryList, 'change', breakPointChange)
      }
      events.add(window, 'orientationchange', resizeFix)
      events.add(window, 'resize', resize)
      checkBreakpoint()
    }

    function initTrack(idx?) {
      slider.animator.stop()
      const details = slider.track.details

      slider.track.init(idx ?? (details ? details.abs : 0))
    }

    function optionsChanged(idx?) {
      initTrack(idx)
      slider.emit('optionsChanged')
    }

    function update(options?, idx?) {
      if (options) {
        init(options)
        optionsChanged(idx)
        return
      }
      updateSize()
      updateSlides()
      const slidesCount = getSlidesConfigLength()
      renewTrackConfig()
      if (getSlidesConfigLength() !== slidesCount) {
        optionsChanged(idx)
      } else {
        initTrack(idx)
      }
      slider.emit('updated')
    }

    function renewTrackConfig() {
      const slides = slider.options.slides
      if (typeof slides === 'function')
        return (slider.options.trackConfig = slides(slider.size, slider.slides))
      const elems = slider.slides
      const elemsCount = elems.length
      const slidesCount: number =
        typeof slides === 'number'
          ? slides
          : getProp(slides, 'number', elemsCount, true)
      const config = []
      const perView = getProp<number | 'auto'>(slides, 'perView', 1, true)
      const spacing =
        (getProp(slides, 'spacing', 0, true) as number) / slider.size || 0
      const spacingPortion =
        perView === 'auto' ? spacing : spacing / (perView as number)
      const originOption = getProp(slides, 'origin', 'auto') as any
      let length = 0
      for (let i = 0; i < slidesCount; i++) {
        const size =
          perView === 'auto'
            ? getElementSize(elems[i])
            : 1 / (perView as number) - spacing + spacingPortion
        const origin =
          originOption === 'center'
            ? 0.5 - size / 2
            : originOption === 'auto'
            ? 0
            : originOption
        config.push({
          origin,
          size,
          spacing,
        })
        length += size
      }
      length += spacing * (slidesCount - 1)
      if (originOption === 'auto' && !slider.options.loop && perView !== 1) {
        let checkedLength = 0
        config.map(entry => {
          const space = length - checkedLength
          checkedLength += entry.size + spacing
          if (space >= 1) return entry
          entry.origin = 1 - space - (length > 1 ? 0 : 1 - length)
          return entry
        })
      }
      slider.options.trackConfig = config
    }

    function resize() {
      updateSize()
      const newSize = slider.size
      if (slider.options.disabled || newSize === compareSize) return
      compareSize = newSize
      update()
    }

    function resizeFix() {
      resize()
      setTimeout(resize, 500)
      setTimeout(resize, 2000)
    }

    function updateSize() {
      const size = rect(slider.container)
      slider.size = (slider.options.vertical ? size.height : size.width) || 1
    }

    function updateSlides() {
      slider.slides = elems(slider.options.selector, slider.container)
    }

    slider.container = elem(container)

    slider.destroy = () => {
      events.purge()
      slider.emit('destroyed')
      applyAttributes(true)
    }

    slider.prev = () => {
      slider.moveToIdx(slider.track.details.abs - 1, true)
    }

    slider.next = () => {
      slider.moveToIdx(slider.track.details.abs + 1, true)
    }

    slider.update = update

    init(slider.options)
  }
}
