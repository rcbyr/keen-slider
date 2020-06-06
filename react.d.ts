import React from 'react'
import KeenSlider, { TOptionsEvents } from './index'

export default KeenSlider

type THookReturn<T extends HTMLElement> = [React.RefObject<T>, KeenSlider]

export function useKeenSlider<T extends HTMLElement>(
  options?: TOptionsEvents
): THookReturn<T>
