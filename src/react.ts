import { MutableRefObject, useCallback, useEffect, useRef } from 'react'

import { equal } from './core/utils'
import KeenSlider from './keen-slider'
import {
  KeenSliderHooks,
  KeenSliderInstance,
  KeenSliderOptions,
  KeenSliderPlugin,
} from './types'

export * from './keen-slider'

function checkOptions(currentOptions, newOptions) {
  if (!equal(currentOptions.current, newOptions)) {
    currentOptions.current = newOptions
  }
  return currentOptions.current
}

export function useKeenSlider<
  T extends HTMLElement,
  O = {},
  P = {},
  H extends string = KeenSliderHooks
>(
  options?: KeenSliderOptions<O, P, H>,
  plugins?:
    | {
        [key: string]: KeenSliderPlugin | false
      }
    | KeenSliderPlugin[]
): [(node: T | null) => void, MutableRefObject<KeenSliderInstance<O, P, H> | null>] {
  const sliderRef = useRef<KeenSliderInstance<O, P, H> | null>(null)
  const optionsCheckedFirst = useRef(false)
  const currentOptions = useRef(options)

  const onRefChange = useCallback((node: T) => {
    if (node) {
      currentOptions.current = options
      sliderRef.current = new KeenSlider<O, P, H>(node, options, plugins)
      optionsCheckedFirst.current = false
    } else {
      if (sliderRef.current && sliderRef.current.destroy)
        sliderRef.current.destroy()

      sliderRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!optionsCheckedFirst.current) {
      optionsCheckedFirst.current = true
      return
    }
    if (sliderRef.current) sliderRef.current.update(currentOptions.current)
  }, [checkOptions(currentOptions, options)])

  return [onRefChange, sliderRef]
}
