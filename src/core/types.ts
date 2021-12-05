export type TrackDetails = {
  abs: number
  length: number
  max: number
  maxIdx: number
  min: number
  minIdx: number
  position: number
  rel: number
  progress: number
  slides: { abs: number; distance: number; portion: number; size: number }[]
}

export type TrackSlidesConfigEntry = {
  origin?: Number
  size?: Number
  spacing?: Number
} | null

export type TrackSlidesConfigOption = TrackSlidesConfigEntry[]

export type SliderHooks =
  | HOOK_CREATED
  | HOOK_ANIMATION_ENDED
  | HOOK_ANIMATION_STARTED
  | HOOK_ANIMATION_STOPPED
  | HOOK_SLIDE_CHANGED
  | HOOK_DETAILS_CHANGED

export type SliderHookOptions<H extends string, I> = {
  [key in H]?: (slider: I) => void
}

export type SliderOptions<O = {}> = {
  defaultAnimation?: {
    duration?: number
    easing?: (t: number) => number
  }
  initial?: number
  loop?: boolean | { min?: number; max?: number }
  range?: { align?: boolean; min?: number; max?: number }
  rtl?: boolean
  trackConfig?: TrackSlidesConfigOption
} & O

export type SliderInstance<O = {}, C = {}, H extends string = string> = {
  animator: AnimatorInstance
  emit: (name: H | SliderHooks) => void
  moveToIdx: (
    idx: number,
    absolute?: boolean,
    animation?: { duration?: number; easing?: (t: number) => number }
  ) => void
  on: (
    name: H | SliderHooks,
    cb: (props: SliderInstance<O, C, H>) => void,
    remove?: boolean
  ) => void
  options: SliderOptions<O>
  track: TrackInstance
} & C

export type SliderPlugin<O = {}, C = {}, H extends string = string> = (
  slider: SliderInstance<O, C, H>
) => void

export interface AnimatorInstance {
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

export interface TrackInstance {
  absToRel: (absoluteIdx: number) => number
  add: (value: number) => void
  details: TrackDetails
  distToIdx: (distance: number) => number
  idxToDist: (idx: number, absolute?: boolean, fromPosition?: number) => number
  init: (idx?: number) => void
  to: (value: number) => void
  velocity: () => number
}

export type HOOK_ANIMATION_ENDED = 'animationEnded'
export type HOOK_ANIMATION_STARTED = 'animationStarted'
export type HOOK_ANIMATION_STOPPED = 'animationStopped'
export type HOOK_CREATED = 'created'
export type HOOK_SLIDE_CHANGED = 'slideChanged'
export type HOOK_DETAILS_CHANGED = 'detailsChanged'
