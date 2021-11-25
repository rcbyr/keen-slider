import { TrackSlidesConfigOption } from '../keen-slider'

export interface WebOptions<O> {
  disabled?: boolean
  selector?:
    | string
    | ((
        container: HTMLElement
      ) => HTMLElement[] | Element[] | NodeList | HTMLCollection | null)
    | null
  slides?:
    | ((size: number, slides: HTMLElement[]) => TrackSlidesConfigOption)
    | number
    | {
        origin?: 'center' | 'auto' | number
        number?: number | (() => number | null) | null
        perView?: 'auto' | number | (() => number | 'auto')
        spacing?: number | (() => number)
      }
    | null
  vertical?: boolean
  breakpoints?: {
    [key: string]: Omit<O, 'breakpoints'>
  }
}

export interface WebInstance<O> {
  container: HTMLElement
  destroy: () => void
  next: () => void
  prev: () => void
  slides: HTMLElement[]
  size: number
  update: (options?: O) => void
}

export interface DragOptions {
  drag?: boolean
  dragSpeed?: number | ((val: number) => number)
  rubberband?: boolean
}

export interface RendererOptions {
  renderMode?: RENDER_MODE_PRECISION | RENDER_MODE_PERFORMANCE
}

export interface DragAnimationOptions<M> {
  mode?: M
  rubberband?: boolean
}

export type RENDER_MODE_PRECISION = 'precision'
export type RENDER_MODE_PERFORMANCE = 'performance'

export type DRAG_ANIMATION_MODE_SNAP = 'snap'
export type DRAG_ANIMATION_MODE_FREE_SNAP = 'free-snap'
export type DRAG_ANIMATION_MODE_FREE = 'free'

export type HOOK_OPTIONS_CHANGED = 'optionsChanged'
export type HOOK_UPDATED = 'updated'
export type HOOK_DRAGGED = 'dragged'
export type HOOK_DRAG_ENDED = 'dragEnded'
export type HOOK_DRAG_STARTED = 'dragStarted'
export type HOOK_DESTROYED = 'destroyed'
