import { MutableRefObject } from 'react'
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  NativeMethods,
} from 'react-native'

import { TrackSlidesConfigOption } from '../../core/types'
import {
  DRAG_ANIMATION_MODE_FREE,
  DRAG_ANIMATION_MODE_FREE_SNAP,
  DRAG_ANIMATION_MODE_SNAP,
  DragAnimationOptions,
} from '../types'

export type NativeOptions = {
  drag?: boolean
  dragSpeed?: number | ((val: number) => number)
  rubberband?: boolean
  slides?:
    | ((size: number) => TrackSlidesConfigOption)
    | number
    | {
        origin?: 'center' | 'auto' | number
        number?: number | (() => number | null) | null
        perView?: number | (() => number)
        spacing?: number | (() => number)
      }

  vertical?: boolean
} & DragAnimationOptions<
  | DRAG_ANIMATION_MODE_SNAP
  | DRAG_ANIMATION_MODE_FREE_SNAP
  | DRAG_ANIMATION_MODE_FREE
>

export type SlideProps = {
  ref?: MutableRefObject<NativeMethods | null>
  style?: {
    height: number | string
    left: number | string
    position: string
    top: number | string
    width: number | string
  }
}

export interface NativeInstance<O> {
  containerProps: {
    onStartShouldSetResponder?: (event: GestureResponderEvent) => void
    onResponderMove?: (event: GestureResponderEvent) => void
    onResponderRelease?: (event: GestureResponderEvent) => void
    onResponderTerminate?: (event: GestureResponderEvent) => void
    onLayout?: (event: LayoutChangeEvent) => void
  }
  slidesProps: SlideProps[]
  size: number
  update: (options?: O, idx?: number) => void
}

export type HOOK_LAYOUT_CHANGED = 'layoutChanged'
