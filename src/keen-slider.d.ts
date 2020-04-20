type TSelectorOrElement = HTMLElement | string
type TSlideFunction = () => NodeListOf<Element>

type TDetails = {
  direction: number,
  progress: number,
  progressSlides: {
    distance: number,
    progress: number
  },
  currentSlide: number,
  targetSlide: number,
}

type TOptionsEvents = {
  changed?: (idx: number) => void
  created?: () => void
  dragStart?: () => void
  dragEnd?: () => void
  move?: (details: TDetails) => void
  touchControl?: boolean
  initialSlide?: number
  loop?: boolean
  moveDuration?: number
  selectorSlide?: string | TSlideFunction
  selectorTrack?: TSelectorOrElement
  virtualSlides?: number | null
}

export default class KeenSlider {
  constructor(container: TSelectorOrElement, options?: TOptionsEvents)
  current: number
  length: number
  destroy: () => void
  moveToSlide: (slide: number, instant?: boolean) => void
  next: () => void
  prev: () => void
  reset: () => void
  updateLoop: () => void
  resize: () => void
  setTouchControls: (activate: boolean) => void
}
