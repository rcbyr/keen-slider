import {
  SliderHooks,
  SliderInstance,
  TrackDetails,
  TrackInstance,
} from './types'
import { clamp, getProp, isNumber, now, round, sign } from './utils'

export default function Track(
  slider: SliderInstance<{}, {}, SliderHooks>
): TrackInstance {
  // eslint-disable-next-line prefer-const
  let instance: TrackInstance

  const infinity = Infinity
  let measurePoints = []

  let currentIdx = null
  let length
  let trackLength
  let opts
  let slides
  let slidesCount
  let relativePositions
  let maxRelativeIdx

  let position = 0

  let minIdx, maxIdx, loopMin, loopMax, min, max

  function add(value) {
    to(position + value)
  }

  function setRange() {
    const rangeOption = slider.options.range
    const loop = slider.options.loop
    loopMin = minIdx = loop ? getProp(loop, 'min', -infinity) : 0
    loopMax = maxIdx = loop ? getProp(loop, 'max', infinity) : maxRelativeIdx
    const dragMin = getProp(rangeOption, 'min', null)
    const dragMax = getProp(rangeOption, 'max', null)
    if (dragMin !== null) minIdx = dragMin
    if (dragMax !== null) maxIdx = dragMax
    min =
      minIdx === -infinity
        ? minIdx
        : slider.track.idxToDist(minIdx || 0, true, 0)
    max = maxIdx === infinity ? maxIdx : idxToDist(maxIdx, true, 0)
    if (dragMax === null) loopMax = maxIdx
    if (
      getProp(rangeOption, 'align', false) &&
      maxIdx !== infinity &&
      slides[absToRel(maxIdx)][2] === 0
    ) {
      max = max - (1 - slides[absToRel(maxIdx)][0])
      maxIdx = distToIdx(max - position)
    }
    min = round(min)
    max = round(max)
  }

  function details(): TrackDetails {
    if (!slidesCount) return

    const loop = getLoop()
    const positionMod = loop ? position % length : position
    const positionRelative = loop
      ? ((position % length) + length) % length
      : position

    const viewportPosition = positionMod - slides[0][2]
    const slidesStart =
      0 -
      (viewportPosition < 0 && loop
        ? length - Math.abs(viewportPosition)
        : viewportPosition)
    let sumLength = 0

    let { abs, rel } = getIndexes(position)
    const activeOrigin = slides[rel][2]
    const slideDetails = slides.map((slide, idx) => {
      let distanceViewport = slidesStart + sumLength
      if (distanceViewport < 0 - slide[0] || distanceViewport > 1) {
        distanceViewport +=
          (Math.abs(distanceViewport) > length - 1 && loop ? length : 0) *
          sign(-distanceViewport)
      }

      const idxDistance = idx - rel
      const signIdxDistance = sign(idxDistance)
      let absoluteIndex = idxDistance + abs
      if (loop) {
        if (signIdxDistance === -1 && distanceViewport > activeOrigin)
          absoluteIndex += slidesCount
        if (signIdxDistance === 1 && distanceViewport < activeOrigin)
          absoluteIndex -= slidesCount
        if (loopMin !== null && absoluteIndex < loopMin)
          distanceViewport += length
        if (loopMax !== null && absoluteIndex > loopMax)
          distanceViewport -= length
      }

      const end = distanceViewport + slide[0] + slide[1]
      const viewPortPortion = Math.max(
        distanceViewport >= 0 && end <= 1
          ? 1
          : end < 0 || distanceViewport > 1
          ? 0
          : distanceViewport < 0
          ? Math.min(1, (slide[0] + distanceViewport) / slide[0])
          : (1 - distanceViewport) / slide[0],
        0
      )
      sumLength += slide[0] + slide[1]

      return {
        abs: absoluteIndex,
        distance: !isRtl()
          ? distanceViewport
          : distanceViewport * -1 + 1 - slide[0],
        portion: viewPortPortion,
        size: slide[0],
      }
    })
    abs = clampIdx(abs)
    rel = absToRel(abs)
    return {
      abs: clampIdx(abs),
      length: trackLength,
      max,
      maxIdx,
      min,
      minIdx,
      position,
      progress: loop ? positionRelative / length : position / trackLength,
      rel,
      slides: slideDetails,
      slidesLength: length,
    }
  }

  function distToIdx(distance) {
    const { abs } = getIndexes(position + distance)
    return idxInRange(abs) ? abs : null
  }

  function getIndexes(pos) {
    let factor = Math.floor(Math.abs(round(pos / length)))
    let positionRelative = round(((pos % length) + length) % length)
    if (positionRelative === length) {
      positionRelative = 0
    }
    const positionSign = sign(pos)
    const origin = relativePositions.indexOf(
      [...relativePositions].reduce((a, b) =>
        Math.abs(b - positionRelative) < Math.abs(a - positionRelative) ? b : a
      )
    )
    let idx = origin
    if (positionSign < 0) factor++
    if (origin === slidesCount) {
      idx = 0
      factor += positionSign > 0 ? 1 : -1
    }
    const abs = idx + factor * slidesCount * positionSign
    return {
      abs,
      origin,
      rel: idx,
    }
  }

  function velocity() {
    const timestampNow = now()
    const data = measurePoints.reduce(
      (acc, next) => {
        const { distance } = next
        const { timestamp } = next
        if (timestampNow - timestamp > 200) return acc
        if (sign(distance) !== sign(acc.distance) && acc.distance) {
          acc = { distance: 0, lastTimestamp: 0, time: 0 }
        }
        if (acc.time) acc.distance += distance
        if (acc.lastTimestamp) acc.time += timestamp - acc.lastTimestamp
        acc.lastTimestamp = timestamp
        return acc
      },
      { distance: 0, lastTimestamp: 0, time: 0 }
    )
    return data.distance / data.time || 0
  }

  function idxToDist(idx, absolute, fromPosition) {
    let distance

    if (absolute || !getLoop()) return absoluteIdxToDist(idx, fromPosition)
    if (!idxInRange(idx)) return null
    const { abs, rel } = getIndexes(fromPosition ?? position)
    const idxDistance = idx - rel
    const nextIdx = abs + idxDistance
    distance = absoluteIdxToDist(nextIdx)
    const otherDistance = absoluteIdxToDist(
      nextIdx - slidesCount * sign(idxDistance)
    )
    if (
      (otherDistance !== null &&
        Math.abs(otherDistance) < Math.abs(distance)) ||
      distance === null
    ) {
      distance = otherDistance
    }
    return round(distance)
  }

  function absoluteIdxToDist(idx, fromPosition?) {
    if (fromPosition == null) fromPosition = round(position)
    if (!idxInRange(idx) || idx === null) return null
    idx = Math.round(idx)
    const { abs, rel, origin } = getIndexes(fromPosition)
    const idxRelative = absToRel(idx)
    const positionRelative = ((fromPosition % length) + length) % length
    const distanceToStart = relativePositions[origin]
    const distance = Math.floor((idx - (abs - rel)) / slidesCount) * length
    return round(
      distanceToStart -
        positionRelative -
        distanceToStart +
        relativePositions[idxRelative] +
        distance +
        (origin === slidesCount ? length : 0)
    )
  }

  function idxInRange(idx) {
    return clampIdx(idx) === idx
  }

  function initSlides() {
    opts = slider.options
    slides = (opts.trackConfig || []).map(entry => [
      getProp(entry, 'size', 1),
      getProp(entry, 'spacing', 0),
      getProp(entry, 'origin', 0),
    ])
    slidesCount = slides.length
    if (!slidesCount) return
    length = round(slides.reduce((acc, val) => acc + val[0] + val[1], 0))

    const lastIdx = slidesCount - 1
    trackLength = round(
      length +
        slides[0][2] -
        slides[lastIdx][0] -
        slides[lastIdx][2] -
        slides[lastIdx][1]
    )
    let lastDistance
    relativePositions = slides.reduce((acc, val) => {
      if (!acc) return [0]
      const prev = slides[acc.length - 1]
      let distance = acc[acc.length - 1] + (prev[0] + prev[2]) + prev[1]

      distance -= val[2]
      if (acc[acc.length - 1] > distance) distance = acc[acc.length - 1]
      distance = round(distance)
      acc.push(distance)
      if (!lastDistance || lastDistance < distance)
        maxRelativeIdx = acc.length - 1
      lastDistance = distance
      return acc
    }, null)
    if (trackLength === 0) maxRelativeIdx = 0
    relativePositions.push(round(length))
  }

  function clampIdx(idx) {
    return clamp(idx, minIdx, maxIdx)
  }

  function getLoop() {
    return opts.loop
  }

  function isRtl() {
    return opts.rtl
  }

  function measure(distance) {
    measurePoints.push({
      distance,
      timestamp: now(),
    })
    if (measurePoints.length > 6) measurePoints = measurePoints.slice(-6)
  }

  function absToRel(idx) {
    return ((idx % slidesCount) + slidesCount) % slidesCount
  }

  function to(value) {
    measure(value - position)
    position = round(value)
    const idx = trackUpdate()['abs']
    if (idx !== currentIdx) {
      const emitEvent = currentIdx === null ? false : true
      currentIdx = idx
      if (emitEvent) slider.emit('slideChanged')
    }
  }

  function trackUpdate(unset?: boolean) {
    const newDetails = unset ? null : details()
    instance.details = newDetails
    slider.emit('detailsChanged')
    return newDetails
  }

  function init(index) {
    initSlides()
    if (!slidesCount) return trackUpdate(true)
    setRange()
    if (isNumber(index)) {
      add(absoluteIdxToDist(clampIdx(index)))
    } else {
      trackUpdate()
    }
  }

  instance = {
    absToRel,
    add,
    details: null,
    distToIdx,
    idxToDist,
    init,
    to,
    velocity,
  }

  return instance
}
