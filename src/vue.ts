import { isRef, onMounted, onUnmounted, Ref, ref, watch } from 'vue'

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
  options: Ref<KeenSliderOptions<O, P, H>> | KeenSliderOptions<O, P, H>,
  plugins?: KeenSliderPlugin<O, P, H>[]
): [Ref<T | undefined>, Ref<KeenSliderInstance<O, P, H> | undefined>] {
  const container = ref<T>()
  const slider = ref<KeenSliderInstance<O, P, H>>()

  if (isRef(options)) {
    watch(options, (newOptions, _) => {
      if (slider.value) slider.value.update(newOptions)
    })
  }

  onMounted(() => {
    if (container.value)
      slider.value = new KeenSlider<O, P, H>(
        container.value,
        isRef(options) ? options.value : options,
        plugins
      )
  })

  onUnmounted(() => {
    if (slider.value) slider.value.destroy()
  })

  return [container, slider]
}
