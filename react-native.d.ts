import { MutableRefObject } from 'react'
import { GestureResponderEvent } from 'react-native'
import { LayoutChangeEvent } from 'react-native'
import { NativeMethods } from 'react-native'

export declare interface AnimatorInstance {
  active: boolean
  start: (
    keyframes: {
      distance: number
      duration: number
      earlyExit?: number
      easing: (t: number) => number
    }[]
  ) => void
  stop: () => void
  targetIdx: number | null
}

declare const _default: new <
  O = {},
  P = {},
  H extends string = KeenSliderNativeHooks
>(
  options?: KeenSliderNativeOptions<O, P, H>,
  plugins?: KeenSliderNativePlugin<O, P, H>[]
) => KeenSliderNativeInstance<O, P, H>
export default _default

export declare type DRAG_ANIMATION_MODE_FREE = 'free'

export declare type DRAG_ANIMATION_MODE_FREE_SNAP = 'free-snap'

export declare type DRAG_ANIMATION_MODE_SNAP = 'snap'

export declare interface DragAnimationOptions<M> {
  mode?: M
  rubberband?: boolean
}

export declare type HOOK_ANIMATION_ENDED = 'animationEnded'

export declare type HOOK_ANIMATION_STARTED = 'animationStarted'

export declare type HOOK_ANIMATION_STOPPED = 'animationStopped'

export declare type HOOK_CREATED = 'created'

export declare type HOOK_DETAILS_CHANGED = 'detailsChanged'

export declare type HOOK_DRAG_CHECKED = 'dragChecked'

export declare type HOOK_DRAG_ENDED = 'dragEnded'

export declare type HOOK_DRAG_STARTED = 'dragStarted'

export declare type HOOK_DRAGGED = 'dragged'

export declare type HOOK_LAYOUT_CHANGED = 'layoutChanged'

export declare type HOOK_OPTIONS_CHANGED = 'optionsChanged'

export declare type HOOK_SLIDE_CHANGED = 'slideChanged'

export declare type HOOK_UPDATED = 'updated'

export declare type KeenSliderNativeHooks =
  | SliderHooks
  | HOOK_UPDATED
  | HOOK_DRAGGED
  | HOOK_DRAG_ENDED
  | HOOK_DRAG_STARTED
  | HOOK_DRAG_CHECKED

export declare type KeenSliderNativeInstance<
  O = {},
  P = {},
  H extends string = KeenSliderNativeHooks
> = SliderInstance<
  KeenSliderNativeOptions<O, P, H>,
  NativeInstance<KeenSliderNativeOptions<O, P, H>> & P,
  KeenSliderNativeHooks | H
>

export declare type KeenSliderNativeOptions<
  O = {},
  P = {},
  H extends string = KeenSliderNativeHooks
> = SliderOptions<NativeOptions> & {
  [key in Exclude<
    H | KeenSliderNativeHooks,
    keyof SliderOptions<NativeOptions>
  >]?: (slider: KeenSliderNativeInstance<O, P, H>) => void
} & Omit<O, keyof SliderOptions<NativeOptions>>

export declare type KeenSliderNativePlugin<
  O = {},
  P = {},
  H extends string = KeenSliderNativeHooks
> = SliderPlugin<
  KeenSliderNativeOptions<O, P, H>,
  KeenSliderNativeInstance<O, P, H>,
  KeenSliderNativeHooks | H
>

export declare interface NativeInstance<O> {
  containerProps: {
    onStartShouldSetResponder?: (event: GestureResponderEvent) => void
    onResponderMove?: (event: GestureResponderEvent) => void
    onResponderRelease?: (event: GestureResponderEvent) => void
    onResponderTerminate?: (event: GestureResponderEvent) => void
    onLayout?: (event: LayoutChangeEvent) => void
  }
  slidesProps: SlideProps[]
  size: number
  next: () => void
  prev: () => void
  update: (options?: O, idx?: number) => void
}

export declare type NativeOptions = {
  drag?: boolean
  dragSpeed?: number | ((val: number) => number)
  rubberband?: boolean
  slides?:
    | ((size: number) => TrackSlidesConfigOption)
    | number
    | {
        origin?: 'center' | 'auto' | number
        number?: number | (() => number | null) | null
        perView?: number | (() => number)
        spacing?: number | (() => number)
      }
  vertical?: boolean
} & DragAnimationOptions<
  | DRAG_ANIMATION_MODE_SNAP
  | DRAG_ANIMATION_MODE_FREE_SNAP
  | DRAG_ANIMATION_MODE_FREE
>

export declare type SlideProps = {
  ref?: MutableRefObject<NativeMethods | null>
  style?: {
    height: number | string
    left: number | string
    position: string
    top: number | string
    width: number | string
  }
}

export declare type SliderHookOptions<H extends string, I> = {
  [key in H]?: (slider: I) => void
}

export declare type SliderHooks =
  | HOOK_CREATED
  | HOOK_ANIMATION_ENDED
  | HOOK_ANIMATION_STARTED
  | HOOK_ANIMATION_STOPPED
  | HOOK_SLIDE_CHANGED
  | HOOK_DETAILS_CHANGED

export declare type SliderInstance<
  O = {},
  C = {},
  H extends string = string
> = {
  animator: AnimatorInstance
  emit: (name: H | SliderHooks) => void
  moveToIdx: (
    idx: number,
    absolute?: boolean,
    animation?: {
      duration?: number
      easing?: (t: number) => number
    }
  ) => void
  on: (
    name: H | SliderHooks,
    cb: (props: SliderInstance<O, C, H>) => void,
    remove?: boolean
  ) => void
  options: SliderOptions<O>
  track: TrackInstance
} & C

export declare type SliderOptions<O = {}> = {
  defaultAnimation?: {
    duration?: number
    easing?: (t: number) => number
  }
  initial?: number
  loop?:
    | boolean
    | {
        min?: number
        max?: number
      }
  range?: {
    align?: boolean
    min?: number
    max?: number
  }
  rtl?: boolean
  trackConfig?: TrackSlidesConfigOption
} & O

export declare type SliderPlugin<O = {}, C = {}, H extends string = string> = (
  slider: SliderInstance<O, C, H>
) => void

export declare type TrackDetails = {
  abs: number
  length: number
  max: number
  maxIdx: number
  min: number
  minIdx: number
  position: number
  rel: number
  progress: number
  slides: {
    abs: number
    distance: number
    portion: number
    size: number
  }[]
  slidesLength: number
}

export declare interface TrackInstance {
  absToRel: (absoluteIdx: number) => number
  add: (value: number) => void
  details: TrackDetails
  distToIdx: (distance: number) => number
  idxToDist: (idx: number, absolute?: boolean, fromPosition?: number) => number
  init: (idx?: number) => void
  to: (value: number) => void
  velocity: () => number
}

export declare type TrackSlidesConfigEntry = {
  origin?: Number
  size?: Number
  spacing?: Number
} | null

export declare type TrackSlidesConfigOption = TrackSlidesConfigEntry[]

export declare function useKeenSliderNative<
  O = {},
  P = {},
  H extends string = KeenSliderNativeHooks
>(
  options?: KeenSliderNativeOptions<O, P, H>,
  plugins?: KeenSliderNativePlugin<O, P, H>[]
): KeenSliderNativeInstance<O, P, H>

export {}
