import { TrackSlidesConfigOption } from '../../keen-slider'

export interface WebOptions<O> {
  /**
   * If this option is set to true, the slider is disabled. No styles or events will be applied. The default is false.
   */
  disabled?: boolean
  /**
   * Enables or disables the rubberband behavior for dragging and animation after a drag. Default is true.
   */
  selector?:
    | string
    | HTMLElement[]
    | NodeList
    | HTMLCollection
    | ((
        container: HTMLElement
      ) => HTMLElement[] | NodeList | HTMLCollection | null)
    | null
  /**
   * Specifies the configuration of the slides. Every time there is an update, resize or change of options, the slide configuration is renewed. Therefore, all functions are called again. Default is null.
   */
  slides?:
    | ((size: number, slides: HTMLElement[]) => TrackSlidesConfigOption)
    | number
    | {
        origin?: 'center' | 'auto' | number
        /**
         * Specifies the slides configuration with an object of optional properties.
         */
        number?: number | (() => number | null) | null
        /**
         * Determines what size the slides should be in relation to the viewport/container. If set to auto, the slide size is determined based on the size of there corresponding HTML element. Therefore, the selector-options must not be null. Can be a function as well, that returns number or 'auto'. Default is 1.
         */
        perView?: 'auto' | number | (() => number | 'auto')
        /**
         * Defines the spacing between slides in pixel. Can be a function that returns a number. Default is 0.
         */
        spacing?: number | (() => number)
      }
    | null
  /**
   * Changes the direction of the slider from horizontal to vertical. (Note: The height of the container must be defined if vertical is true) Default is false.
   */
  vertical?: boolean
  /**
   * Changes the options or event hooks for a given breakpoint by overriding the options at the root level. Each key has to be a valid media query string e.g. (orientation: portrait) and (min-width: 500px). Each value has to be an object with options and/or event hooks. Note: If multiple media queries match, the last one is applied. See the example below:
   * @example
   * new KeenSlider('#my-slider', {
   *  loop: true,
   *  breakpoints: {
   *    '(min-width: 500px)': {
   *    loop: false,
   *    },
   *  },
   * });
   */
  breakpoints?: {
    [key: string]: Omit<O, 'breakpoints'>
  }
}

export interface WebInstance<O> {
  /**
   * The HTML element, that is defined as the container/viewport for the slides.
   */
  container: HTMLElement
  /**
   * A function that destroys the slider when called. All events and applied styles will be removed.
   */
  destroy: () => void
  /**
   * Changes the currently active slide to the next one when called. If exists.
   */
  next: () => void
  /**
   * Changes the currently active slide to the previous one when called. If exists.
   */
  prev: () => void
  /**
   * The slides as an array of HTML elements.
   */
  slides: HTMLElement[]
  /**
   * The size of the container/viewport, width or height, depending on the vertical option.
   */
  size: number
  /**
   * Returns the current speed of the track as distance in relation to the viewport per millisecond.
   * @param options Returns the current speed of the track as distance in relation to the viewport per millisecond.
   * @param idx Sets the current active slide to the given index. Default undefined.
   * @returns 
   */
  update: (options?: O, idx?: number) => void
}

export interface DragOptions {
  /**
   * Enables or disables mouse and touch control. Default is true
   */
  drag?: boolean
  /**
   * Set the speed that is applied to the slider when dragging it. Number can be passed as a value or function. Minus values would invert the swipe direction. Default is 1
   */
  dragSpeed?: number | ((val: number) => number)
  /**
   * Enables or disables the rubberband behavior for dragging and animation after a drag. Default is true.
   */
  rubberband?: boolean
}

export interface RendererOptions {
  /**
   * It is possible that the render performance of the browser slows down, if you have slides with some complexity in markup and CSS. To counteract this problem, you can set this option to 'performance'. If you want to create your own renderer, you can set this options to 'custom'. Default is 'precision'.
   */
  renderMode?:
    | RENDER_MODE_PRECISION
    | RENDER_MODE_PERFORMANCE
    | RENDER_MODE_CUSTOM
}

export type Container =
  | string
  | HTMLElement
  | NodeList
  | ((
      wrapper: HTMLElement | Document
    ) => HTMLElement[] | NodeList | HTMLCollection | null)

export type RENDER_MODE_PRECISION = 'precision'
export type RENDER_MODE_PERFORMANCE = 'performance'
export type RENDER_MODE_CUSTOM = 'custom'

export type HOOK_DESTROYED = 'destroyed'
export type HOOK_BEFORE_OPTIONS_CHANGED = 'beforeOptionsChanged'
