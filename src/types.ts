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
  HOOK_DRAG_ENDED,
  HOOK_DRAG_STARTED,
  HOOK_DRAGGED,
  HOOK_OPTIONS_CHANGED,
  HOOK_UPDATED,
} from './plugins/types'
import {
  DragOptions,
  HOOK_DESTROYED,
  RendererOptions,
  WebInstance,
  WebOptions,
} from './plugins/web/types'

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
  [key in Exclude<
    H | KeenSliderHooks,
    keyof SliderOptions<WebOptions<{}>> &
      DragOptions &
      RendererOptions &
      DragAnimationOptions<
        | DRAG_ANIMATION_MODE_SNAP
        | DRAG_ANIMATION_MODE_FREE
        | DRAG_ANIMATION_MODE_FREE_SNAP
      >
  >]?: (slider: KeenSliderInstance<O, P, H>) => void
} & Omit<
    O,
    keyof SliderOptions<WebOptions<{}>> &
      DragOptions &
      RendererOptions &
      DragAnimationOptions<
        | DRAG_ANIMATION_MODE_SNAP
        | DRAG_ANIMATION_MODE_FREE
        | DRAG_ANIMATION_MODE_FREE_SNAP
      >
  >

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
> = SliderOptions<
  DragAnimationOptions<
    | DRAG_ANIMATION_MODE_SNAP
    | DRAG_ANIMATION_MODE_FREE
    | DRAG_ANIMATION_MODE_FREE_SNAP
  >
> & {
  [key in Exclude<
    H | KeenSliderNativeHooks,
    keyof SliderOptions<{}> &
      DragAnimationOptions<
        | DRAG_ANIMATION_MODE_SNAP
        | DRAG_ANIMATION_MODE_FREE
        | DRAG_ANIMATION_MODE_FREE_SNAP
      >
  >]?: (slider: KeenSliderNativeInstance<O, P, H>) => void
} & Omit<
    O,
    keyof SliderOptions<{}> &
      DragAnimationOptions<
        | DRAG_ANIMATION_MODE_SNAP
        | DRAG_ANIMATION_MODE_FREE
        | DRAG_ANIMATION_MODE_FREE_SNAP
      >
  >

export type KeenSliderNativeInstance<
  O = {},
  P = {},
  H extends string = KeenSliderNativeHooks
> = SliderInstance<
  KeenSliderNativeOptions<O, P, H>,
  {},
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
