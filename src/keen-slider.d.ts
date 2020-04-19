type TContainer = HTMLElement | string
type TOptionsEvents = {
  changed?: (idx: number) => void
  created?: () => void
  dragStart?: () => void
  dragEnd?: () => void
  touchControl?: boolean
  initialSlide?: number
  classSlide?: string
  loop?: boolean
  moveDuration?: number
  classTrack?: string
}

export default class KeenSlider {
  constructor(container: TContainer, options?: TOptionsEvents)
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
