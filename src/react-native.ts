import { useEffect, useRef, useState } from 'react'

import Slider from './core/slider'
import { equal } from './core/utils'
import Modes from './plugins/modes'
import Native from './plugins/native/native'
import { SlideProps } from './plugins/native/types'
import {
  KeenSliderNativeHooks,
  KeenSliderNativeInstance,
  KeenSliderNativeOptions,
  KeenSliderNativePlugin,
} from './types'

function checkOptions(currentOptions, newOptions) {
  if (!equal(currentOptions.current, newOptions)) {
    currentOptions.current = newOptions
  }
  return currentOptions.current
}

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
