import type { WidthHeight } from '@/lib/canvas'
import type { Direction } from 're-resizable/lib/resizer'
import { createContext, useContext } from 'react'

interface ResizeStartCallbackParams {
  event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  direction: Direction
  elementRef: HTMLElement
}

interface ResizeCallbackParams {
  event: MouseEvent | TouchEvent
  direction: Direction
  elementRef: HTMLElement
  delta: WidthHeight
}

export interface ResizeStartEvent {
  id: string
  resizeCallbackParams: ResizeStartCallbackParams
}

export interface ResizeEvent {
  id: string
  resizeCallbackParams: ResizeCallbackParams
}

export type OnResizeStart = (params: ResizeStartEvent) => void

export type OnResize = (params: ResizeEvent) => void

export interface ResizeContextValue {
  onResizeStart: OnResizeStart
  onResize: OnResize
  onResizeStop: OnResize
}

export const ResizeContext = createContext<ResizeContextValue | null>(null)

export function useResizeContext() {
  const resizeContext = useContext(ResizeContext)

  if (!resizeContext) {
    throw new Error('useResizeContext can only be used inside ResizeContext')
  }

  return resizeContext
}
