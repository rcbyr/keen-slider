type TContainer = HTMLElement | string
type TOptionsEvents = {
  changed?: (idx: number) => void
  created?: () => void
  controls?: boolean
  initialIdx?: number
  itemClassName?: string
  loop?: boolean
  moveDuration?: number
  trackClassName?: string
}

export default class KeenSlider {
  constructor(container: TContainer, options?: TOptionsEvents)
  slide: number
  length: number
  moveToSlide: (slide: number, instant?: boolean) => void
  next: () => void
  prev: () => void
  refresh: () => void
  refreshLoopSlides: () => void
  resize: () => void
}
