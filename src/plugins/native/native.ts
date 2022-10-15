import { createRef } from 'react'

import { SliderInstance, SliderPlugin } from '../../core/types'
import { getProp } from '../../core/utils'
import {
  HOOK_DRAG_CHECKED,
  HOOK_DRAG_ENDED,
  HOOK_DRAG_STARTED,
  HOOK_DRAGGED,
  HOOK_UPDATED,
} from '../types'
import Drag from './drag'
import Renderer from './renderer'
import { HOOK_LAYOUT_CHANGED, NativeInstance, NativeOptions } from './types'

export default function Native<O>(
  defaultOptions: O
): SliderPlugin<{}, {}, HOOK_UPDATED> {
  return (
    slider: SliderInstance<
      NativeOptions,
      NativeInstance<{}>,
      | HOOK_UPDATED
      | HOOK_LAYOUT_CHANGED
      | HOOK_DRAG_ENDED
      | HOOK_DRAG_STARTED
      | HOOK_DRAGGED
      | HOOK_DRAG_CHECKED
    >
  ): void => {
    let mounted = false

    function initTrack(idx?) {
      slider.animator.stop()
      const details = slider.track.details
      slider.track.init(idx ?? (details ? details.abs : 0))
    }

    function updateSlides(newLength) {
      const currentLength = slider.slidesProps.length
      if (currentLength === newLength) return
      const diff = newLength - currentLength
      if (diff > 0) {
        slider.slidesProps.push(
          ...Array(diff)
            .fill(null)
            .map(() => ({ ref: createRef() }))
        )
      } else {
        slider.slidesProps.splice(diff)
      }
    }

    function updateTrackConfig() {
      const slides = slider.options.slides
      if (typeof slides === 'function')
        return (slider.options.trackConfig = slides(slider.size))
      const slidesCount: number =
        typeof slides === 'number' ? slides : getProp(slides, 'number', 0, true)
      const config = []
      const perView = getProp<number>(slides, 'perView', 1, true)
      const spacing =
        (getProp(slides, 'spacing', 0, true) as number) / slider.size || 0
      const spacingPortion = spacing / (perView as number)
      const originOption = getProp(slides, 'origin', 'auto') as any
      let length = 0
      for (let i = 0; i < slidesCount; i++) {
        const size = 1 / (perView as number) - spacing + spacingPortion
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
      updateSlides(slider.options.trackConfig.length)
    }

    function onLayout(e) {
      const newSize = slider.options.vertical
        ? e.nativeEvent.layout.height
        : e.nativeEvent.layout.width
      if (newSize === slider.size) return
      slider.size = newSize
      if (!mounted) {
        mounted = true
      }
      updateTrackConfig()
      initTrack()
      slider.emit('layoutChanged')
    }

    function update(options?, idx?) {
      if (options) {
        slider.options = { ...defaultOptions, ...options }
      }
      updateTrackConfig()
      initTrack(idx)
      slider.emit('updated')
    }

    function init() {
      slider.options = { ...defaultOptions, ...slider.options }
      updateTrackConfig()
    }

    slider.containerProps = {
      onLayout,
    }
    slider.slidesProps = []
    slider.update = update

    slider.prev = () => {
      slider.moveToIdx(slider.track.details.abs - 1, true)
    }

    slider.next = () => {
      slider.moveToIdx(slider.track.details.abs + 1, true)
    }

    init()

    Renderer(slider)
    Drag(slider)
  }
}
