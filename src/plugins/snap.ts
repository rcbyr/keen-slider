import { SliderInstance } from '../core/types'
import { clamp, sign } from '../core/utils'
import {
  DragAnimationOptions,
  HOOK_DRAG_ENDED,
  HOOK_DRAG_STARTED,
  HOOK_DRAGGED,
  HOOK_OPTIONS_CHANGED,
  HOOK_UPDATED,
} from './types'

export default function Snap(
  slider: SliderInstance<
    DragAnimationOptions<string>,
    {},
    | HOOK_OPTIONS_CHANGED
    | HOOK_DRAG_STARTED
    | HOOK_DRAG_ENDED
    | HOOK_DRAGGED
    | HOOK_UPDATED
  >
): void {
  let startIdx, moveIdx
  let min
  let max
  function end() {
    const track = slider.track
    const details = slider.track.details
    const position = details.position
    let direction = sign(track.velocity())
    if (position > max || position < min) {
      direction = 0
    }

    let idx = startIdx + direction
    if (details.slides[track.absToRel(idx)].portion === 0) idx -= direction

    if (startIdx !== moveIdx) {
      idx = moveIdx
    }
    if (sign(track.idxToDist(idx, true)) !== direction) idx += direction
    idx = clampIdx(idx)
    const dist = track.idxToDist(idx, true)
    slider.animator.start([
      {
        distance: dist,
        duration: 500,
        easing: t => 1 + --t * t * t * t * t,
      },
    ])
  }

  function clampIdx(idx) {
    return clamp(idx, min, max)
  }

  function drag() {
    moveIdx = slider.track.details.abs
  }

  function update() {
    const remove = slider.options.mode !== 'snap'
    slider.on('dragStarted', start, remove)
    slider.on('dragged', drag, remove)
    slider.on('dragEnded', end, remove)

    const details = slider.track.details
    if (!details) return
    min = details.minIdx
    max = details.maxIdx
  }

  function start() {
    slider.animator.stop()
    startIdx = moveIdx = slider.track.details.abs
  }

  slider.on('updated', update)
  slider.on('optionsChanged', update)
  slider.on('created', update)
}
