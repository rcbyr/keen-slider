type TSelectorOrElement = HTMLElement | string
type TSlideFunction = () => HTMLElement[]

type TOptionsEvents = {
  changed?: (idx: number) => void
  created?: () => void
  dragStart?: () => void
  dragEnd?: () => void
  touchControl?: boolean
  initialSlide?: number
  loop?: boolean
  moveDuration?: number
  selectorSlide?: string | TSlideFunction
  selectorTrack?: TSelectorOrElement
}

export default class KeenSlider {
  constructor(container: TSelectorOrElement, options?: TOptionsEvents)
  current: number
  length: number
  destroy: () => void
  moveToSlide: (slide: number, instant?: boolean) => void
  next: () => void
  prev: () => void
  refresh: () => void
  refreshLoopSlides: () => void
  addTouchContols: () => void
  removeTouchControls: () => void
  resize: () => void
}
