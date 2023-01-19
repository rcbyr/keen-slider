import { TrackSlidesConfigOption } from '../../keen-slider'

export interface WebOptions<O> {
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
  update: (options?: O, idx?: number) => void
}

export interface DragOptions {
  drag?: boolean
  dragSpeed?: number | ((val: number) => number)
  rubberband?: boolean
}

export interface RendererOptions {
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
