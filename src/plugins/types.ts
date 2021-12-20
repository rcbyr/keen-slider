export type HOOK_UPDATED = 'updated'
export type HOOK_DRAGGED = 'dragged'
export type HOOK_DRAG_ENDED = 'dragEnded'
export type HOOK_DRAG_STARTED = 'dragStarted'
export type HOOK_DRAG_CHECKED = 'dragChecked'
export type HOOK_OPTIONS_CHANGED = 'optionsChanged'

export type DRAG_ANIMATION_MODE_SNAP = 'snap'
export type DRAG_ANIMATION_MODE_FREE_SNAP = 'free-snap'
export type DRAG_ANIMATION_MODE_FREE = 'free'

export interface DragAnimationOptions<M> {
  mode?: M
  rubberband?: boolean
}
