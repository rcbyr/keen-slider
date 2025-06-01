import { Ref } from 'vue'

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

export declare type Container =
  | string
  | HTMLElement
  | NodeList
  | ((
      wrapper: HTMLElement | Document
    ) => HTMLElement[] | NodeList | HTMLCollection | null)

export declare type DRAG_ANIMATION_MODE_FREE = 'free'

export declare type DRAG_ANIMATION_MODE_FREE_SNAP = 'free-snap'

export declare type DRAG_ANIMATION_MODE_SNAP = 'snap'

export declare interface DragAnimationOptions<M> {
  mode?: M
  rubberband?: boolean
}

export declare interface DragOptions {
  drag?: boolean
  dragSpeed?: number | ((val: number) => number)
  rubberband?: boolean
}

export declare type HOOK_ANIMATION_ENDED = 'animationEnded'

export declare type HOOK_ANIMATION_STARTED = 'animationStarted'

export declare type HOOK_ANIMATION_STOPPED = 'animationStopped'

export declare type HOOK_BEFORE_OPTIONS_CHANGED = 'beforeOptionsChanged'

export declare type HOOK_CREATED = 'created'

export declare type HOOK_DESTROYED = 'destroyed'

export declare type HOOK_DETAILS_CHANGED = 'detailsChanged'

export declare type HOOK_DRAG_CHECKED = 'dragChecked'

export declare type HOOK_DRAG_ENDED = 'dragEnded'

export declare type HOOK_DRAG_STARTED = 'dragStarted'

export declare type HOOK_DRAGGED = 'dragged'

export declare type HOOK_OPTIONS_CHANGED = 'optionsChanged'

export declare type HOOK_SLIDE_CHANGED = 'slideChanged'

export declare type HOOK_UPDATED = 'updated'

export declare type KeenSliderHooks =
  | SliderHooks
  | HOOK_OPTIONS_CHANGED
  | HOOK_UPDATED
  | HOOK_DRAGGED
  | HOOK_DRAG_ENDED
  | HOOK_DRAG_STARTED
  | HOOK_DRAG_CHECKED
  | HOOK_DESTROYED
  | HOOK_BEFORE_OPTIONS_CHANGED

export declare type KeenSliderInstance<
  O = {},
  P = {},
  H extends string = KeenSliderHooks
> = SliderInstance<
  KeenSliderOptions<O, P, H>,
  WebInstance<KeenSliderOptions<O, P, H>> & P,
  KeenSliderHooks | H
>

export declare type KeenSliderOptions<
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

export declare type KeenSliderPlugin<
  O = {},
  P = {},
  H extends string = KeenSliderHooks
> = SliderPlugin<
  KeenSliderOptions<O, P, H>,
  KeenSliderInstance<O, P, H>,
  KeenSliderHooks | H
>

export declare type RENDER_MODE_CUSTOM = 'custom'

export declare type RENDER_MODE_PERFORMANCE = 'performance'

export declare type RENDER_MODE_PRECISION = 'precision'

export declare interface RendererOptions {
  renderMode?:
    | RENDER_MODE_PRECISION
    | RENDER_MODE_PERFORMANCE
    | RENDER_MODE_CUSTOM
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

export declare function useKeenSlider<
  T extends HTMLElement,
  O = {},
  P = {},
  H extends string = KeenSliderHooks
>(
  options: Ref<KeenSliderOptions<O, P, H>> | KeenSliderOptions<O, P, H>,
  plugins?: KeenSliderPlugin<O, P, H>[]
): [Ref<T | undefined>, Ref<KeenSliderInstance<O, P, H> | undefined>]

export declare interface WebInstance<O> {
  container: HTMLElement
  destroy: () => void
  next: () => void
  prev: () => void
  slides: HTMLElement[]
  size: number
  update: (options?: O, idx?: number) => void
}

export declare interface WebOptions<O> {
  disabled?: boolean
  selector?:
    | string
    | HTMLElement[]
    | NodeList
    | HTMLCollection
    | ((
        container: HTMLElement
      ) => HTMLElement[] | NodeList | HTMLCollection | null)
    | null
  slides?:
    | ((size: number, slides: HTMLElement[]) => TrackSlidesConfigOption)
    | number
    | {
        origin?: 'center' | 'auto' | number
        number?: number | (() => number | null) | null
        perView?: 'auto' | number | (() => number | 'auto')
        spacing?: number | (() => number)
        numberOfFullWidthShow?: number
      }
    | null
  vertical?: boolean
  breakpoints?: {
    [key: string]: Omit<O, 'breakpoints'>
  }
}

export {}
