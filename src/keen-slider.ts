/* eslint-disable sort-keys */
import Slider from './core/slider'
import Drag from './plugins/drag'
import Modes from './plugins/modes'
import Renderer from './plugins/renderer'
import { Container } from './plugins/types'
import Web from './plugins/web'
import {
  KeenSliderHooks,
  KeenSliderInstance,
  KeenSliderOptions,
  KeenSliderPlugin,
} from './types'

export * from './plugins/types'
export * from './core/types'
export {
  KeenSliderHooks,
  KeenSliderInstance,
  KeenSliderOptions,
  KeenSliderPlugin,
}

const KeenSlider = function (
  container: Container,
  options?: KeenSliderOptions,
  plugins?: KeenSliderPlugin[]
): KeenSliderInstance {
  try {
    const defOpts = {
      drag: true,
      mode: 'snap',
      renderMode: 'precision',
      rubberband: true,
      selector: '.keen-slider__slide',
    } as KeenSliderOptions
    return Slider<KeenSliderOptions, KeenSliderInstance, KeenSliderHooks>(
      options,
      [
        Web<KeenSliderOptions>(container, defOpts),
        Renderer,
        Drag,
        Modes,
        ...(plugins || []),
      ]
    )
  } catch (e) {
    console.error(e)
  }
}

export default KeenSlider as unknown as {
  new <O = {}, P = {}, H extends string = KeenSliderHooks>(
    container: Container,
    options?: KeenSliderOptions<O, P, H>,
    plugins?: KeenSliderPlugin<O, P, H>[]
  ): KeenSliderInstance<O, P, H>
}
