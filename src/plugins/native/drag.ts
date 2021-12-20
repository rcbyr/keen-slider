import { PanResponder } from 'react-native'

import { SliderInstance } from '../../core/types'
import { clamp, inputHandler, sign } from '../../core/utils'
import {
  HOOK_DRAG_CHECKED,
  HOOK_DRAG_ENDED,
  HOOK_DRAG_STARTED,
  HOOK_DRAGGED,
  HOOK_UPDATED,
} from '../types'
import { HOOK_LAYOUT_CHANGED, NativeInstance, NativeOptions } from './types'

export default function Drag(
  slider: SliderInstance<
    NativeOptions,
    NativeInstance<{}>,
    | HOOK_DRAG_ENDED
    | HOOK_DRAG_STARTED
    | HOOK_DRAGGED
    | HOOK_UPDATED
    | HOOK_LAYOUT_CHANGED
    | HOOK_DRAG_CHECKED
  >
): void {
  const breakFactorValue = 2
  let direction
  let defaultDirection
  let size
  let dragActive
  let dragSpeed
  let dragIdentifier
  let dragJustStarted
  let lastValue
  let lastX
  let lastY
  let min
  let max
  function dragStart(e) {
    if (
      dragActive ||
      !slider.track.details ||
      !slider.track.details.length ||
      !slider.options.drag
    )
      return
    dragActive = true
    dragJustStarted = true
    dragIdentifier = e.idChanged
    isSlide(e)
    lastValue = xy(e)
    slider.emit('dragStarted')
    return true
  }
  function drag(e) {
    if (!dragActive || dragIdentifier !== e.idChanged) {
      return
    }

    const value = xy(e)
    if (dragJustStarted) {
      if (!isSlide(e)) return dragStop(e)
      slider.emit('dragChecked')
      dragJustStarted = false
    }

    const distance = rubberband(
      (dragSpeed(lastValue - value) / slider.size) * defaultDirection
    )

    direction = sign(distance)
    slider.track.add(distance)
    lastValue = value
    slider.emit('dragged')
  }
  function setSpeed() {
    const speed = slider.options.dragSpeed || 1
    dragSpeed =
      typeof speed === 'function' ? speed : val => val * (speed as number)
  }
  function dragStop(e) {
    if (!dragActive || dragIdentifier !== e.idChanged) return
    dragActive = false
    slider.emit('dragEnded')
  }

  function isSlide(e) {
    const vertical = slider.options.vertical
    const x = vertical ? e.y : e.x
    const y = vertical ? e.x : e.y
    const isSlide =
      lastX !== undefined &&
      lastY !== undefined &&
      Math.abs(lastY - y) <= Math.abs(lastX - x)
    lastX = x
    lastY = y
    return isSlide
  }

  function rubberband(distance) {
    if (min === -Infinity && max === Infinity) return distance
    const details = slider.track.details
    const length = details.length
    const position = details.position
    const clampedDistance = clamp(distance, min - position, max - position)
    if (length === 0) return 0
    if (!slider.options.rubberband) {
      return clampedDistance
    }

    if (position <= max && position >= min) return distance
    if (
      (position < min && direction > 0) ||
      (position > max && direction < 0)
    ) {
      return distance
    }

    const overflow = (position < min ? position - min : position - max) / length

    const trackSize = size * length
    const overflowedSize = Math.abs(overflow * trackSize)
    const p = Math.max(0, 1 - (overflowedSize / size) * breakFactorValue)
    return p * p * distance
  }

  function setSizes() {
    size = slider.size
    const details = slider.track.details
    if (!details) return
    min = details.min
    max = details.max
  }

  function xy(e) {
    return slider.options.vertical ? e.y : e.x
  }

  function update() {
    setSizes()
    setSpeed()
    defaultDirection = !slider.options.rtl ? 1 : -1
  }

  slider.on('updated', update)
  slider.on('layoutChanged', update)
  slider.on('created', update)

  const pan = PanResponder.create({
    onPanResponderMove: inputHandler(drag),
    onPanResponderRelease: inputHandler(dragStop),
    onPanResponderTerminate: inputHandler(dragStop),
    onStartShouldSetPanResponder: inputHandler(dragStart),
  })
  Object.assign(slider.containerProps, pan.panHandlers)
}
