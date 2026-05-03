import { useState, type PropsWithChildren } from 'react'
import type { Coordinates, WidthHeight } from '@/lib/canvas'
import { createRoundingSnapModifier, GridContext } from './gridContext'
import { gridRound } from '@/lib/utils'

export default function GridContextProvider({
  children,
  initialState,
}: PropsWithChildren<{
  initialState: { cellSize: WidthHeight; gridVisible?: boolean }
}>) {
  const [cellSize, setCellSize] = useState(initialState.cellSize)
  const [gridVisible, setGridVisible] = useState(
    initialState.gridVisible ?? true
  )

  return (
    <GridContext.Provider
      value={{
        cellSize,
        setCellSize,
        gridVisible,
        setGridVisible,
        cellRound: (c: Coordinates) => ({
          x: Math.round(c.x / cellSize.width),
          y: Math.round(c.y / cellSize.height),
        }),
        cellRoundX: (x: number) => Math.round(x / cellSize.width),
        cellRoundY: (y: number) => Math.round(y / cellSize.height),
        gridRoundX: (x: number) => gridRound(x, cellSize.width),
        gridRoundY: (y: number) => gridRound(y, cellSize.height),
        gridRound: (c: Coordinates) => ({
          x: gridRound(c.x, cellSize.width),
          y: gridRound(c.y, cellSize.height),
        }),
        resizeWidth: (width: number) =>
          Math.max(cellSize.width, gridRound(width, cellSize.width)),
        resizeHeight: (height: number) =>
          Math.max(cellSize.height, gridRound(height, cellSize.height)),
        snapToGrid: createRoundingSnapModifier(cellSize.width, cellSize.height),
      }}
    >
      {children}
    </GridContext.Provider>
  )
}
