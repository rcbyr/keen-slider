export type TrackDetails = {
  /**
   * Absolute index of the currently active slide.
   */
  abs: number
  /**
   * Length of the track in relation to the size of the viewport.
   */
  length: number
  /**
   * Maximum position according to the reachable slide
   */
  max: number
  /**
   * Maximum position according to the reachable slide
   */
  maxIdx: number
  /**
   * Minimum position according to the reachable slide
   */
  min: number
  minIdx: number
  /**
   * Current position of the track in relation to the size of the viewport.
   */
  position: number
  /**
   * Relative index of the currently active slide.
   */
  rel: number
  /**
   * Relative position of track in relation to the length.
   */
  progress: number
  /**
   * Details of each slide as an array of objects.
   */
  slides: {
    /**
     * Absolute index of this slide. Only reliable if portion is > 0
     */
    abs: number
    /**
     * Distance of the slide to the beginning of the viewport.
     */
    distance: number
    /**
     * Indicates how much of the slide is visible in the viewport.
     */
    portion: number
    /**
     * Size of the slide in relation to the size of the viewport.
     */
    size: number
  }[]
  /**
   * Length of the slides and the spacing between them.
   */
  slidesLength: number
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
  /**
   * Sets the default animation of the functions 'moveToIdx', 'next' and 'prev'.
   */
  defaultAnimation?: {
    /**
     * Duration of the animation in milliseconds.
     */
    duration?: number
    /**
     * Easing of the animation as (time: number) => number.
     */
    easing?: (t: number) => number
  }
  /**
   * Sets the index of the initially visible slide. Default is 1.
   */
  initial?: number
  /**
   * Sets the index of the initially visible slide. Default is 1.
   */
  loop?: boolean | { min?: number; max?: number }
  /**
   * Sets the index of the initially visible slide. Default is 1.
   */
  range?: {
    /**
     * Aligns the maximum position to the end of the last slide
     */
    align?: boolean
    /**
     * Sets minimum accessible index
     */
    min?: number
    /**
     * Sets maximum accessible index
     */
    max?: number
  }
  /**
   * It is possible that the render performance of the browser slows down, if you have slides with some complexity in markup and CSS. To counteract this problem, you can set this option to 'performance'. If you want to create your own renderer, you can set this options to 'custom'. Default is 'precision'.
   */
  rtl?: boolean
  trackConfig?: TrackSlidesConfigOption
} & O

export type SliderInstance<O = {}, C = {}, H extends string = string> = {
  /**
   * The animator is the module that is responsible for the motion animation of the track.
   */
  animator: AnimatorInstance
  /**
   * Emits an event when called. Requires an eventName: string as an argument.
   */
  emit: (name: H | SliderHooks) => void
  /**
   * Changes the active slide with an animation when called.
   * @param idx Specifies the index to be set active.
   * @param absolute Defines if the index is absolute. Default is false.
   * @param animation Modifies the default animation.
   * @returns
   */
  moveToIdx: (
    idx: number,
    absolute?: boolean,
    animation?: {
      /**
       * Sets the animation duration is milliseconds. Default is 500.
       */
      duration?: number
      /**
       * Sets the easing function. Default is t => 1 + --t * t * t * t * t.
       */
      easing?: (t: number) => number
    }
  ) => void
  /**
   * Registers an event hook when called.
   * @param name Registers an event hook when called.
   * @param cb The function that will be called on this event.
   * @param remove Whether the function should be set or removed. Default is false.
   * @returns
   */
  on: (
    name: H | SliderHooks,
    cb: (props: SliderInstance<O, C, H>) => void,
    remove?: boolean
  ) => void
  /**
   * The currently used Options and Event hooks with regard to the active breakpoint.
   */
  options: SliderOptions<O>
  track: TrackInstance
} & C

export type SliderPlugin<O = {}, C = {}, H extends string = string> = (
  slider: SliderInstance<O, C, H>
) => void

export interface AnimatorInstance {
  /**
   * Indicates whether an animation is active.
   */
  active: boolean
  /**
   * Starts a new animation. Needs an array of keyframes. The keyframes are processed sequentially.
   */
  start: (
    keyframes: {
      /**
       * Distance moved in the animation.
       */
      distance: number
      /**
       * Distance moved in the animation.
       */
      duration: number
      /**
       * Optionally sets an earlier termination of the keyframe.
       */
      earlyExit?: number
      /**
       * Easing of the animation as (time: number) => number.
       */
      easing: (t: number) => number
    }[]
  ) => void
  /**
   * Stops the currently active animation, if there is one.
   */
  stop: () => void
  /**
   * Stops the currently active animation, if there is one.
   */
  targetIdx: number | null
}

export interface TrackInstance {
  /**
   * Transforms an absolute index into the corresponding relative index.
   */
  absToRel: (absoluteIdx: number) => number
  /**
   * Adds the passed value to the track position.
   */
  add: (value: number) => void
  /**
   * The current details of the track. Position, length, sizes and distances are relative to the container/viewport size. Is set to null if the slider is disabled or not ready.
   */
  details: TrackDetails
  /**
   * Transforms the passed distance into the corresponding index.
   * @returns 
   */
  distToIdx: (distance: number) => number
  /**
   * Returns the distance to the passed index. The second argument is optional and a boolean that specifies whether the passed index is absolute. The third argument is optional and specifies a reference position.
   */
  idxToDist: (idx: number, absolute?: boolean, fromPosition?: number) => number
  /**
   * Reinitializes the track. Optionally, a new active index can be passed.
   */
  init: (idx?: number) => void
  /**
   * Sets the passed value as the track position.
   */
  to: (value: number) => void
  /**
   * Returns the current speed of the track as distance in relation to the viewport per millisecond.
   */
  velocity: () => number
}

export type HOOK_ANIMATION_ENDED = 'animationEnded'
export type HOOK_ANIMATION_STARTED = 'animationStarted'
export type HOOK_ANIMATION_STOPPED = 'animationStopped'
export type HOOK_CREATED = 'created'
export type HOOK_SLIDE_CHANGED = 'slideChanged'
export type HOOK_DETAILS_CHANGED = 'detailsChanged'
