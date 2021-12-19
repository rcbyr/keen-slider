import { useEffect, useRef, useState } from 'react'

import Slider from './core/slider'
import {
  SliderHooks,
  SliderInstance,
  SliderOptions,
  SliderPlugin,
} from './core/types'
import { checkOptions } from './core/utils'
import Modes from './plugins/modes'
import Native from './plugins/native/native'
import {
  NativeInstance,
  NativeOptions,
  SlideProps,
} from './plugins/native/types'
import {
  HOOK_DRAG_ENDED,
  HOOK_DRAG_STARTED,
  HOOK_DRAGGED,
  HOOK_UPDATED,
} from './plugins/types'

export type KeenSliderNativeHooks =
  | SliderHooks
  | HOOK_UPDATED
  | HOOK_DRAGGED
  | HOOK_DRAG_ENDED
  | HOOK_DRAG_STARTED

export type KeenSliderNativeOptions<
  O = {},
  P = {},
  H extends string = KeenSliderNativeHooks
> = SliderOptions<NativeOptions> & {
  [key in Exclude<
    H | KeenSliderNativeHooks,
    keyof SliderOptions<NativeOptions>
  >]?: (slider: KeenSliderNativeInstance<O, P, H>) => void
} & Omit<O, keyof SliderOptions<NativeOptions>>

export type KeenSliderNativeInstance<
  O = {},
  P = {},
  H extends string = KeenSliderNativeHooks
> = SliderInstance<
  KeenSliderNativeOptions<O, P, H>,
  NativeInstance<KeenSliderNativeOptions<O, P, H>> & P,
  KeenSliderNativeHooks | H
>

export type KeenSliderNativePlugin<
  O = {},
  P = {},
  H extends string = KeenSliderNativeHooks
> = SliderPlugin<
  KeenSliderNativeOptions<O, P, H>,
  KeenSliderNativeInstance<O, P, H>,
  KeenSliderNativeHooks | H
>

export * from './plugins/types'
export * from './plugins/native/types'
export * from './core/types'

const KeenSliderNative = function (
  options?: KeenSliderNativeOptions,
  plugins?: KeenSliderNativePlugin[]
): KeenSliderNativeInstance {
  try {
    const defOpts = {
      drag: true,
      mode: 'snap',
      rubberband: true,
    } as KeenSliderNativeOptions
    return Slider<
      KeenSliderNativeOptions,
      KeenSliderNativeInstance,
      KeenSliderNativeHooks
    >(options, [
      Native<KeenSliderNativeOptions>(defOpts),
      Modes,
      ...(plugins || []),
    ])
  } catch (e) {
    console.error(e)
  }
}

export default KeenSliderNative as unknown as {
  new <O = {}, P = {}, H extends string = KeenSliderNativeHooks>(
    options?: KeenSliderNativeOptions<O, P, H>,
    plugins?: KeenSliderNativePlugin<O, P, H>[]
  ): KeenSliderNativeInstance<O, P, H>
}

export function useKeenSliderNative<
  O = {},
  P = {},
  H extends string = KeenSliderNativeHooks
>(
  options?: KeenSliderNativeOptions<O, P, H>,
  plugins?: KeenSliderNativePlugin<O, P, H>[]
): [KeenSliderNativeInstance<O, P, H>, SlideProps[]] {
  const optionsCheckedFirst = useRef(false)
  const currentOptions = useRef(options)
  const sliderRef = useRef(KeenSliderNative(options, plugins))
  const [slidesProps, setSlidesProps] = useState(sliderRef.current.slidesProps)
  useEffect(() => {
    if (!optionsCheckedFirst.current) {
      sliderRef.current.on('update', () => {
        if (slidesProps.length !== sliderRef.current.slides.length)
          setSlidesProps(sliderRef.current.slides)
      })
      optionsCheckedFirst.current = true
      return
    }
    if (sliderRef.current) sliderRef.current.update(currentOptions.current)
  }, [checkOptions(currentOptions, options)])

  return [sliderRef.current, slidesProps]
}
