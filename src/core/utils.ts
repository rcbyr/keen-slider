function toArray(nodeList) {
  return Array.prototype.slice.call(nodeList)
}

function getFloatOrInt(float, int) {
  const floatFloor = Math.floor(float)
  if (floatFloor === int || floatFloor + 1 === int) return float
  return int
}

export function now(): number {
  return Date.now()
}

export function dir(element): string {
  return window.getComputedStyle(element, null).getPropertyValue('direction')
}

export function setAttr(elem: HTMLElement, name: string, value: string): void {
  const prefix = 'data-keen-slider-'
  name = prefix + name
  if (value === null) return elem.removeAttribute(name)
  elem.setAttribute(name, value || '')
}

export function elem(
  element:
    | string
    | HTMLElement
    | NodeList
    | ((
        wrapper: HTMLElement | Document
      ) => HTMLElement[] | NodeList | HTMLCollection | null),
  wrapper?: HTMLElement
): HTMLElement {
  const elements = elems(element, wrapper || document)
  return elements.length ? elements[0] : null
}

export function elems(
  elements:
    | string
    | HTMLElement
    | HTMLElement[]
    | NodeList
    | HTMLCollection
    | null
    | ((
        wrapper: HTMLElement | Document
      ) =>
        | string
        | HTMLElement
        | HTMLElement[]
        | NodeList
        | HTMLCollection
        | null),
  wrapper: HTMLElement | Document
): HTMLElement[] {
  wrapper = wrapper || document
  if (typeof elements === 'function') elements = elements(wrapper)

  return Array.isArray(elements)
    ? elements
    : typeof elements === 'string'
    ? toArray(wrapper.querySelectorAll(elements))
    : elements instanceof HTMLElement
    ? [elements]
    : elements instanceof NodeList
    ? toArray(elements)
    : []
}

export function prevent(e: any): void {
  if (e.raw) e = e.raw
  if (e.cancelable && !e.defaultPrevented) e.preventDefault()
}

export function stop(e: any): void {
  if (e.raw) e = e.raw
  if (e.stopPropagation) e.stopPropagation()
}

export function inputHandler(handler: any): any {
  return e => {
    if (e.nativeEvent) e = e.nativeEvent
    const changedTouches = e.changedTouches || []
    const touchPoints = e.targetTouches || []
    const detail = e.detail && e.detail.x ? e.detail : null
    return handler({
      id: detail
        ? detail.identifier
          ? detail.identifier
          : 'i'
        : !touchPoints[0]
        ? 'd'
        : touchPoints[0]
        ? touchPoints[0].identifier
        : 'e',
      idChanged: detail
        ? detail.identifier
          ? detail.identifier
          : 'i'
        : !changedTouches[0]
        ? 'd'
        : changedTouches[0]
        ? changedTouches[0].identifier
        : 'e',
      raw: e,
      x:
        detail && detail.x
          ? detail.x
          : touchPoints[0]
          ? touchPoints[0].screenX
          : detail
          ? detail.x
          : e.pageX,
      y:
        detail && detail.y
          ? detail.y
          : touchPoints[0]
          ? touchPoints[0].screenY
          : detail
          ? detail.y
          : e.pageY,
    })
  }
}

export function Events(): {
  add: (
    element: Element | Document | Window | MediaQueryList,
    event: string,
    handler: (event: Event) => void,
    options?: AddEventListenerOptions
  ) => void
  input: (
    element: Element | Document | Window | MediaQueryList,
    event: string,
    handler: (event: Event) => void,
    options?: AddEventListenerOptions
  ) => void
  purge: () => void
} {
  let events = []

  return {
    add(element, event, handler, options) {
      ;(element as MediaQueryList).addListener
        ? (element as MediaQueryList).addListener(handler)
        : element.addEventListener(event, handler, options)
      events.push([element, event, handler, options])
    },
    input(element, event, handler, options) {
      this.add(element, event, inputHandler(handler), options)
    },
    purge() {
      events.forEach(event => {
        event[0].removeListener
          ? event[0].removeListener(event[2])
          : event[0].removeEventListener(event[1], event[2], event[3])
      })
      events = []
    },
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function sign(x: number): number {
  return (x > 0 ? 1 : 0) - (x < 0 ? 1 : 0) || +x
}

export function getFrame(cb: FrameRequestCallback): number {
  return window.requestAnimationFrame(cb)
}

export function cancelFrame(id: number): void {
  return window.cancelAnimationFrame(id)
}

export function rect(elem: HTMLElement): { height: number; width: number } {
  const boundingRect = elem.getBoundingClientRect()

  return {
    height: getFloatOrInt(boundingRect.height, elem.offsetHeight),
    width: getFloatOrInt(boundingRect.width, elem.offsetWidth),
  }
}

export function isNumber(n: unknown): boolean {
  return Number(n) === n
}

export function getProp<R>(
  obj: {},
  key: string,
  fallback: R,
  resolve?: boolean
): R {
  const prop = obj && obj[key]
  if (typeof prop === 'undefined' || prop === null) return fallback
  return resolve && typeof prop === 'function' ? prop() : prop
}

export function style(
  elem: HTMLElement,
  style: string,
  value: string | null
): void {
  elem.style[style] = value
}

export function round(value: number): number {
  return Math.round(value * 1000000) / 1000000
}

export function equal(v1: any, v2: any): boolean {
  if (v1 === v2) return true
  const t1 = typeof v1
  const t2 = typeof v2
  if (t1 !== t2) return false
  if (t1 === 'object' && v1 !== null && v2 !== null) {
    if (
      v1.length !== v2.length ||
      Object.getOwnPropertyNames(v1).length !==
        Object.getOwnPropertyNames(v2).length
    )
      return false
    for (const prop in v1) {
      if (!equal(v1[prop], v2[prop])) return false
    }
  } else if (t1 === 'function') {
    return v1.toString() === v2.toString()
  } else {
    return false
  }
  return true
}

export function checkOptions(currentOptions, newOptions) {
  if (!equal(currentOptions.current, newOptions)) {
    currentOptions.current = newOptions
  }
  return currentOptions.current
}
