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

export default function Free(
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
  let isFreeSnap
  let currentDirection
  let min
  let max
  let minIdx
  let maxIdx

  function adjustDuration(duration) {
    return duration * 2
  }

  function t(x) {
    return 1 - Math.pow(-x + 1, 1 / 3)
  }

  function x(t) {
    return 1 - Math.pow(1 - t, 3)
  }

  function end() {
    stop()
    const track = slider.track
    const speed = track.velocity()
    currentDirection = sign(speed)
    const trackDetails = slider.track.details
    const keyframes = []
    if (!speed && isFreeSnap) {
      slider.moveToIdx(clamp(trackDetails.abs, minIdx, maxIdx), true, {
        duration: 500,
        easing: t => 1 + --t * t * t * t * t,
      })
      return
    }
    let { dist, dur } = speedToDistanceAndDuration(speed)
    dur = adjustDuration(dur)
    dist *= currentDirection
    if (isFreeSnap) {
      const snapDist = track.idxToDist(track.distToIdx(dist), true)
      if (snapDist) dist = snapDist
    }

    keyframes.push({
      distance: dist,
      duration: dur,
      easing: x,
    })
    const position = trackDetails.position
    const newPosition = position + dist
    if (newPosition < min || newPosition > max) {
      const newDistance = newPosition < min ? min - position : max - position
      let addToBounceBack = 0
      let bounceSpeed = speed
      if (sign(newDistance) === currentDirection) {
        const distancePortion = Math.min(
          Math.abs(newDistance) / Math.abs(dist),
          1
        )
        const durationPortion = t(distancePortion) * dur
        keyframes[0].earlyExit = durationPortion
        bounceSpeed = speed * (1 - distancePortion)
      } else {
        keyframes[0].earlyExit = 0
        addToBounceBack += newDistance
      }

      const bounce = speedToDistanceAndDuration(bounceSpeed, 100)
      const bounceDist = bounce.dist * currentDirection

      if (slider.options.rubberband) {
        keyframes.push({
          distance: bounceDist,
          duration: adjustDuration(bounce.dur),
          easing: x,
        })
        keyframes.push({
          distance: -bounceDist + addToBounceBack,
          duration: 500,
          easing: x,
        })
      }
    }

    slider.animator.start(keyframes)
  }

  function speedToDistanceAndDuration(s, m = 1000) {
    s = Math.abs(s)
    const decelerationRate = 0.000000147 + s / m
    return {
      dist: Math.pow(s, 2) / decelerationRate,
      dur: s / decelerationRate,
    }
  }

  function update() {
    isFreeSnap = slider.options.mode === 'free-snap'
    const remove = slider.options.mode !== 'free' && !isFreeSnap
    slider.on('dragStarted', start, remove)
    slider.on('dragEnded', end, remove)

    const details = slider.track.details
    if (!details) return
    min = details.min
    max = details.max
    minIdx = details.minIdx
    maxIdx = details.maxIdx
  }

  function start() {
    stop()
  }

  function stop() {
    slider.animator.stop()
  }

  slider.on('updated', update)
  slider.on('optionsChanged', update)
  slider.on('created', update)
}
