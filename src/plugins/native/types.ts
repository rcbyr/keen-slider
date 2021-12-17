import { MutableRefObject } from 'react'
import { LayoutChangeEvent, NativeMethods } from 'react-native'

import { TrackSlidesConfigOption } from '../../core/types'

export interface NativeOptions {
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
}

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
    onLayout?: (event: LayoutChangeEvent) => void
  }
  slidesProps: SlideProps[]
  size: number
  update: (options?: O, idx?: number) => void
}

export type HOOK_LAYOUT_CHANGED = 'layoutChanged'
