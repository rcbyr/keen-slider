import { PanResponder } from 'react-native'

import { SliderInstance } from '../../core/types'
import { clamp, sign } from '../../core/utils'
import {
  HOOK_DRAG_ENDED,
  HOOK_DRAG_STARTED,
  HOOK_DRAGGED,
  HOOK_UPDATED,
} from '../types'
import { HOOK_LAYOUT_CHANGED, NativeInstance, NativeOptions } from './types'

export default function NativeDrag(
  slider: SliderInstance<
    NativeOptions,
    NativeInstance<{}>,
    | HOOK_DRAG_ENDED
    | HOOK_DRAG_STARTED
    | HOOK_DRAGGED
    | HOOK_UPDATED
    | HOOK_LAYOUT_CHANGED
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
  let sumDistance
  let isProperDrag
  let lastX
  let lastY
  let min
  let max
  function dragStart(e) {
    if (dragActive || !slider.track.details || !slider.track.details.length)
      return
    isProperDrag = false
    sumDistance = 0
    dragActive = true
    dragJustStarted = true
    dragIdentifier = 0
    isSlide(e)
    lastValue = xy(e)
    slider.emit('dragStarted')
    return true
  }
  function drag(e) {
    if (!dragActive || dragIdentifier !== 0) {
      return
    }

    const value = xy(e)

    if (!isSlide(e) && dragJustStarted) {
      return dragStop(e)
    }
    if (dragJustStarted) {
      lastValue = value
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
    if (!dragActive || dragIdentifier !== 0) return
    dragActive = false
    slider.emit('dragEnded')
  }

  function isSlide(e) {
    const vertical = slider.options.vertical
    const x = vertical ? e.nativeEvent.pageY : e.nativeEvent.pageX
    const y = vertical ? e.nativeEvent.pageX : e.nativeEvent.pageY
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
    return slider.options.vertical ? e.nativeEvent.pageY : e.nativeEvent.pageX
  }

  function update() {
    setSizes()
    setSpeed()
    defaultDirection = !slider.options.rtl ? 1 : -1
  }

  slider.on('updated', update)
  slider.on('layoutChanged', update)
  slider.on('created', update)

  // slider.containerProps.onStartShouldSetResponder = dragStart
  // slider.containerProps.onResponderMove = drag
  // slider.containerProps.onResponderRelease = dragStop
  // slider.containerProps.onResponderTerminate = dragStop
  // slider.containerProps.onResponderTerminationRequest = () => false
  // slider.containerProps.onStartShouldSetResponderCapture = dragStart

  const pan = PanResponder.create({
    onPanResponderMove: drag,
    onPanResponderRelease: dragStop,
    onPanResponderTerminate: dragStop,
    onPanResponderTerminationRequest: () => false,
    onStartShouldSetPanResponderCapture: dragStart,
  })
  Object.assign(slider.containerProps, pan.panHandlers)
}
