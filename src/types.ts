import {
  SliderHooks,
  SliderInstance,
  SliderOptions,
  SliderPlugin,
} from './keen-slider'
import {
  DRAG_ANIMATION_MODE_FREE,
  DRAG_ANIMATION_MODE_FREE_SNAP,
  DRAG_ANIMATION_MODE_SNAP,
  DragAnimationOptions,
  DragOptions,
  HOOK_DESTROYED,
  HOOK_DRAG_ENDED,
  HOOK_DRAG_STARTED,
  HOOK_DRAGGED,
  HOOK_OPTIONS_CHANGED,
  HOOK_UPDATED,
  RendererOptions,
  WebInstance,
  WebOptions,
} from './plugins/types'

export type KeenSliderHooks =
  | SliderHooks
  | HOOK_OPTIONS_CHANGED
  | HOOK_UPDATED
  | HOOK_DRAGGED
  | HOOK_DRAG_ENDED
  | HOOK_DRAG_STARTED
  | HOOK_DESTROYED

export type KeenSliderOptions<
  O = {},
  P = {},
  H extends string = KeenSliderHooks
> = SliderOptions<
  WebOptions<KeenSliderOptions<O, P, H>> &
    DragOptions &
    RendererOptions &
    DragAnimationOptions<
      | DRAG_ANIMATION_MODE_SNAP
      | DRAG_ANIMATION_MODE_FREE
      | DRAG_ANIMATION_MODE_FREE_SNAP
    >
> & {
  [key in KeenSliderHooks | H]?: (slider: KeenSliderInstance<O, P, H>) => void
} & O

export type KeenSliderInstance<
  O = {},
  P = {},
  H extends string = KeenSliderHooks
> = SliderInstance<
  KeenSliderOptions<O, P, H>,
  WebInstance<KeenSliderOptions<O, P, H>> & P,
  KeenSliderHooks | H
>

export type KeenSliderPlugin<
  O = {},
  P = {},
  H extends string = KeenSliderHooks
> = SliderPlugin<
  KeenSliderOptions<O, P, H>,
  KeenSliderInstance<O, P, H>,
  KeenSliderHooks | H
>
