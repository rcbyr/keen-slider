import { MutableRefObject, useCallback, useEffect, useRef } from 'react'

import { equal } from './core/utils'
import KeenSlider, {
  KeenSliderHooks,
  KeenSliderInstance,
  KeenSliderOptions,
  KeenSliderPlugin,
} from './keen-slider'

export * from './keen-slider'

export function useKeenSlider<
  T extends HTMLElement,
  O = {},
  P = {},
  H extends string = KeenSliderHooks
>(
  options?: KeenSliderOptions<O, P, H>,
  plugins?: KeenSliderPlugin<O, P, H>[]
): [
  (node: T | null) => void,
  MutableRefObject<KeenSliderInstance<O, P, H> | null>
] {
  const sliderRef = useRef<KeenSliderInstance<O, P, H> | null>(null)
  const optionsCheckedFirst = useRef(false)
  const currentOptions = useRef(options)

  const onRefChange = useCallback((node: T | null) => {
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
    if (equal(currentOptions.current, options)) return
    currentOptions.current = options
    if (sliderRef.current) sliderRef.current.update(currentOptions.current)
  }, [options])

  return [onRefChange, sliderRef]
}
