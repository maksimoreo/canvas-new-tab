import { createContext, useContext } from 'react'
import { type Coordinates, type WidthHeight } from '@/lib/canvas'
import type { Modifier } from '@dnd-kit/core'

// Different from dndkit createSnapModifier, this uses Math.round instead of Math.ceil
export function createRoundingSnapModifier(
  gridSizeX: number,
  gridSizeY: number
): Modifier {
  return ({ transform }) => ({
    ...transform,
    x: Math.round(transform.x / gridSizeX) * gridSizeX,
    y: Math.round(transform.y / gridSizeY) * gridSizeY,
  })
}

export interface GridContextValue {
  cellSize: WidthHeight
  setCellSize: (cellSize: WidthHeight) => void
  gridVisible: boolean
  setGridVisible: (gridVisible: boolean) => void
  cellRound: (c: Coordinates) => Coordinates
  cellRoundX: (x: number) => number
  cellRoundY: (y: number) => number
  // If needed in future:
  // cellCeil, cellFloor...
  // gridCeil, gridFloor..
  gridRound: (c: Coordinates) => Coordinates
  gridRoundX: (x: number) => number
  gridRoundY: (y: number) => number
  resizeWidth: (width: number) => number
  resizeHeight: (height: number) => number
  snapToGrid: Modifier
}

export const GridContext = createContext<GridContextValue>({
  cellSize: { width: 32, height: 32 },
  setCellSize: () => undefined!,
  gridVisible: true,
  setGridVisible: () => undefined!,
  cellRound: () => undefined!,
  cellRoundX: () => undefined!,
  cellRoundY: () => undefined!,
  gridRound: () => undefined!,
  gridRoundX: () => undefined!,
  gridRoundY: () => undefined!,
  resizeWidth: () => undefined!,
  resizeHeight: () => undefined!,
  snapToGrid: undefined!,
})

export function useGrid() {
  return useContext(GridContext)
}
