import { SliderInstance } from '../../core/types'
import { HOOK_UPDATED } from '../types'
import { NativeInstance, NativeOptions } from './types'

export default function Renderer(
  slider: SliderInstance<NativeOptions, NativeInstance<{}>, HOOK_UPDATED>
): void {
  function update() {
    if (!slider.track.details) return
    slider.track.details.slides.forEach((slide, idx) => {
      const width = slider.options.vertical ? '100%' : `${slide.size * 100}%`
      const height = !slider.options.vertical ? '100%' : `${slide.size * 100}%`
      const xy = slider.size
        ? slide.distance * slider.size
        : slide.distance * 100 + '%'
      const left = slider.options.vertical ? 0 : xy
      const top = !slider.options.vertical ? 0 : xy
      const position = 'absolute'
      slider.slidesProps[idx].style = { height, left, position, top, width }
      const ref = slider.slidesProps[idx].ref.current
      if (ref) {
        ref.setNativeProps({
          style: {
            height,
            left,
            position,
            top,
            width,
          },
        })
      }
    })
  }

  slider.on('detailsChanged', update)
  slider.on('created', update)
  slider.on('updated', update)
}
