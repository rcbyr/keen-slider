function KeenSlider(c, o) {
  const defaultOptions = {
    changed: function (idx) {
      return
    },
    created: function () {
      return
    },
    controls: true,
    classSlide: 'keen-slider__slide',
    classTrack: 'keen-slider__track',
    moveEasing: function (t) {
      return --t * t * t + 1
    },
    initialSlide: 0,
    loop: true,
    moveDuration: 500,
  }

  let options = null

  let container = null
  let track = null
  let items = []
  const loopItemAttrName = 'data-ke-sl-lo'
  let loopNeedUpdate = true
  let lastWindowWidth = null

  // touch/swipe helper
  const events = []
  let wheelActive = false
  let touchDirection = null
  let touchActive = false
  let touchStartX = null
  let touchLastX = null
  let touchDistance = 0
  let trackXBeforeTouch = null
  let lastTouchClientX = null
  let lastTouchClientY = null
  let scrollingTimeout = null

  // positioning
  let trackX = null
  let targetIdx = 0

  // animation
  let reqId = null
  let startTime = 0
  let moveDistance = null
  let moved = null

  function addToPosition(val) {
    if (trackX !== null && options.loop) {
      if (
        trackX <
        -getContainerWidth() * getItemCount() - getContainerWidth() / 2
      ) {
        targetIdx -= getItemCount()
        trackX =
          -getContainerWidth() +
          getContainerWidth() / 2 -
          (-getContainerWidth() * getItemCount() -
            getContainerWidth() / 2 -
            trackX)
      }
      if (trackX > -getContainerWidth() / 2) {
        targetIdx += getItemCount()
        trackX =
          -getContainerWidth() * getItemLastIdx() +
          getContainerWidth() / 2 +
          (trackX - -getContainerWidth() / 2)
      }
    }
    trackX = trackX - val
    if (!options.loop) {
      trackX = clampValue(trackX, -getContainerWidth() * getItemLastIdx(), 0)
    }
    track.style.transform = `translate3d(${trackX}px, 0, 0)`
  }

  function clampIdx(idx) {
    return clampValue(idx, 0, getItemLastIdx())
  }

  function clampValue(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }

  function dragstart(e) {
    if (touchActive) return
    touchActive = true
    moveAbortAnimate()
    touchStartX = getEventX(e)
    touchLastX = touchStartX
    touchDistance = 0
    trackXBeforeTouch = trackX
  }

  function drag(e) {
    if (touchStartX === null || !touchActive) return
    const x = getEventX(e)

    if (isVerticalSlide(e)) {
      touchLastX = x
      return
    }
    e.preventDefault()
    touchDistance = x - touchLastX
    touchDirection = touchLastX
      ? Math.sign(x - touchLastX)
      : Math.sign(touchDistance - touchStartX)

    addToPosition(touchLastX - x)
    touchLastX = x
  }

  function dragend(e) {
    if (!touchActive) return
    touchActive = false
    const diff = trackX - trackXBeforeTouch
    let idx = getDragEndIdx(diff)
    moveToIdx(idx)
  }

  function errorOnInit() {
    console.error('keen-slider error: markup not correct')
    return false
  }

  function eventAdd(element, event, handler, options = {}) {
    if (Array.isArray(element)) {
      element.forEach(function (elem) {
        eventAdd(elem, event, handler, options)
      })
      return
    }
    if (!element || !element.addEventListener)
      return console.info('event handler could not be assigned')
    element.addEventListener(event, handler, options)
    events.push([element, event, handler])
  }

  function eventsRemove() {
    events.forEach(function (event, idx) {
      event[0].removeEventListener(event[1], event[2])
      delete events[idx]
    })
  }

  function getContainerWidth() {
    return container.offsetWidth
  }

  function getDragEndIdx(diff) {
    if (diff < 0 && touchDirection < 0) {
      return targetIdx + 1
    }
    if (diff > 0 && touchDirection > 0) {
      return targetIdx - 1
    }
    return targetIdx
  }

  function getEventX(e) {
    return e.targetTouches === undefined ? e.pageX : e.targetTouches[0].screenX
  }

  function getAsumendXOfIdx(idx) {
    return -(getContainerWidth() * idx)
  }

  function getItemCount() {
    return options.loop ? items.length - 2 : items.length
  }

  function getInterpolatedItemCount() {
    return items.length
  }

  function getItemLastIdx() {
    return items.length - 1
  }

  function getXOfIdx(idx) {
    return -(getContainerWidth() * clampValue(idx, 0, getItemLastIdx()))
  }

  function init(c, o) {
    container = getContainer(c)
    if (container instanceof HTMLElement === false) return errorOnInit()
    options = { ...defaultOptions, ...o }
    track = container.getElementsByClassName(options.classTrack)[0]
    if (track instanceof HTMLElement === false) return errorOnInit()
    mount(translateFromInputIdx(options.initialSlide))
    options.created.call(pubfuncs)
    return true
  }

  function getContainer(container) {
    if (typeof container === 'string') {
      return document.querySelector(container)
    }
    return container
  }

  function isHidden() {
    return document.hidden
  }

  function isVerticalSlide(e) {
    if (e.targetTouches === undefined) return
    const x = e.targetTouches[0].clientX
    const y = e.targetTouches[0].clientY
    if (lastTouchClientX === null) lastTouchClientX = x
    if (lastTouchClientY === null) lastTouchClientY = y

    if (Math.abs(lastTouchClientY - y) >= Math.abs(lastTouchClientX - x)) {
      lastTouchClientX = x
      lastTouchClientY = y
      return true
    }
  }

  function jumpToIdx(idx) {
    setTargetIdx(idx, true)
    const x = getXOfIdx(idx)
    addToPosition(trackX - x)
    return
  }

  function loopItemsAppend() {
    const first = items[0].cloneNode(true)
    const last = items[getItemLastIdx()].cloneNode(true)
    first.setAttribute(loopItemAttrName, true)
    last.setAttribute(loopItemAttrName, true)
    track.appendChild(first)
    track.insertBefore(last, track.firstChild)
  }

  function refreshLoopItems() {
    const firstToReplace = items[0]
    const first = items[1].cloneNode(true)
    const lastToReplace = items[getItemLastIdx()]
    const last = items[getItemLastIdx() - 1].cloneNode(true)
    first.setAttribute(loopItemAttrName, true)
    last.setAttribute(loopItemAttrName, true)
    track.replaceChild(first, lastToReplace)
    track.replaceChild(last, firstToReplace)
  }

  function loopItemsRemove() {
    const loopItems = track.querySelectorAll('[' + loopItemAttrName + ']')
    for (var i = 0; i < getInterpolatedItemCount(); i++) {
      track.removeChild(loopItems[i])
    }
  }

  function mount(idx) {
    items = track.getElementsByClassName(options.classSlide)
    if (items.length <= 1) {
      return
    }
    if (options.controls) {
      eventAdd(container, 'dragstart', function (e) {
        e.preventDefault()
      })
      eventAdd(container, 'mousedown', dragstart)
      eventAdd(container, 'mousemove', drag)
      eventAdd(container, 'mouseleave', dragend)
      eventAdd(container, 'mouseup', dragend)
      eventAdd(container, 'touchstart', dragstart)
      eventAdd(container, 'touchmove', drag)
      eventAdd(container, 'touchend', dragend)
      eventAdd(container, 'touchcancel', dragend)
      eventAdd(container, 'touchleave', dragend)
      eventAdd(window, 'wheel', wheel, {
        passive: !1,
      })
      eventAdd(window, 'scroll', scroll)
    }
    eventAdd(window, 'orientationchange', multipleResizes)
    eventAdd(window, 'resize', multipleResizes)

    if (options.loop) loopItemsAppend()

    jumpToIdx(idx)
    resize()
  }

  function moveAnimate(timestamp) {
    if (!startTime) startTime = timestamp
    const duration = timestamp - startTime
    if (duration >= options.moveDuration) {
      const add = moveDistance - moved
      startTime = null
      addToPosition(add)
      return
    }

    const add = moveCalcValue(duration)
    moved += add
    addToPosition(add)
    reqId = window.requestAnimationFrame(moveAnimate)
  }

  function moveCalcValue(progress) {
    const value =
      moveDistance * options.moveEasing(progress / options.moveDuration) - moved
    return value
  }

  function moveToIdx(idx) {
    setTargetIdx(idx, !options.loop)
    moveAbortAnimate()
    moveDistance = -(getAsumendXOfIdx(idx) - trackX)
    moved = 0
    window.requestAnimationFrame(moveAnimate)
  }

  function moveAbortAnimate() {
    if (reqId) {
      window.cancelAnimationFrame(reqId)
      reqId = null
    }
    startTime = null
  }

  // ipad orientationchange fix
  function multipleResizes() {
    resize()
    setTimeout(resize, 500)
    setTimeout(resize, 2000)
  }

  function unmount() {
    if (options.loop) loopItemsRemove()
    eventsRemove()
  }

  function resize(all = false) {
    const windowWidth = window.innerWidth
    if (windowWidth === lastWindowWidth && !all) return
    const width = getContainerWidth()

    track.style.width = width * items.length + 'px'
    setItemWidth(getContainerWidth())
    lastWindowWidth = windowWidth
    if (!touchActive) jumpToIdx(targetIdx)
  }

  function setItemWidth(width) {
    for (let i = 0; i < items.length; i++) {
      items[i].style.width = width + 'px'
    }
  }

  function setTargetIdx(idx, clamp) {
    targetIdx = clamp ? clampIdx(idx) : idx
    options.changed.call(pubfuncs, translateToInputIdx(targetIdx))
  }

  function scroll(e) {
    if (touchActive) {
      touchActive = false
      moveToIdx(targetIdx)
    }
    wheelActive = true
    window.clearTimeout(scrollingTimeout)
    scrollingTimeout = setTimeout(() => {
      wheelActive = false
    }, 100)
  }

  function translateFromInputIdx(idx) {
    return options.loop ? idx + 1 : idx
  }

  function translateToInputIdx(idx) {
    if (!options.loop) return idx
    if (idx === 0) idx = getInterpolatedItemCount() - 2
    if (idx === getInterpolatedItemCount() - 1) idx = 1
    idx -= 1
    return idx % getItemCount()
  }

  function refresh() {
    unmount()
    mount(targetIdx)
  }

  function wheel(e) {
    if (touchActive) e.preventDefault()
  }

  const pubfuncs = {
    destroy() {
      unmount()
    },
    prev() {
      if (isHidden()) return
      moveToIdx(targetIdx - 1)
    },
    next() {
      if (isHidden()) return
      moveToIdx(targetIdx + 1)
    },
    moveToSlide: function (slide, instant = false) {
      const idx = clampIdx(translateFromInputIdx(slide))
      return instant ? jumpToIdx(idx) : moveToIdx(idx)
    },
    refresh,
    refreshLoopSlides: refreshLoopItems,
    resize: function () {
      resize(true)
    },
    get slide() {
      return translateToInputIdx(targetIdx)
    },
    get length() {
      return getItemCount()
    },
  }

  init(c, o)
  return pubfuncs
}

if (!Math.sign) {
  Math.sign = function (x) {
    return (x > 0) - (x < 0) || +x
  }
}

module.exports = KeenSlider
