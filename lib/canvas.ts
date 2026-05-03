import type { AlignmentT } from './alignment'

export interface WidthHeight {
  width: number
  height: number
}

export type CanvasItem = GroupItem | LinkItem

export interface CanvasItemTransform {
  local: RectangleTransform
  global: RectangleTransform
  width: number
  height: number
}

export function moveCanvasItemTransform(
  t: CanvasItemTransform,
  delta: Coordinates
): CanvasItemTransform {
  return {
    ...t,
    local: moveTransform(t.local, delta),
    global: moveTransform(t.global, delta),
  }
}

export function moveTransform(
  t: RectangleTransform,
  delta: Coordinates
): RectangleTransform {
  return {
    position: {
      x: t.position.x + delta.x,
      y: t.position.y + delta.y,
    },
    bounds: {
      left: t.bounds.left + delta.x,
      right: t.bounds.right + delta.x,
      top: t.bounds.top + delta.y,
      bottom: t.bounds.bottom + delta.y,
    },
  }
}

export function moveCanvasItemTransformInPlace(
  t: CanvasItemTransform,
  delta: Coordinates
): void {
  moveTransformInPlace(t.local, delta)
  moveTransformInPlace(t.global, delta)
}

export function moveTransformInPlace(
  t: RectangleTransform,
  delta: Coordinates
): void {
  t.position.x += delta.x
  t.position.y += delta.y
  t.bounds.left += delta.x
  t.bounds.right += delta.x
  t.bounds.top += delta.y
  t.bounds.bottom += delta.y
}

export function calculateLocalTransform(
  globalTransform: RectangleTransform,
  parentPosition: Coordinates
): RectangleTransform {
  return {
    position: {
      x: globalTransform.position.x - parentPosition.x,
      y: globalTransform.position.y - parentPosition.y,
    },
    bounds: {
      left: globalTransform.bounds.left - parentPosition.x,
      right: globalTransform.bounds.right - parentPosition.x,
      top: globalTransform.bounds.top - parentPosition.y,
      bottom: globalTransform.bounds.bottom - parentPosition.y,
    },
  }
}

export function resizeCanvasItemTransform(
  t: CanvasItemTransform,
  delta: Coordinates
): CanvasItemTransform {
  return {
    width: t.width + delta.x,
    height: t.height + delta.y,
    local: resizeTransform(t.local, delta),
    global: resizeTransform(t.global, delta),
  }
}

export function resizeTransform(
  t: RectangleTransform,
  delta: Coordinates
): RectangleTransform {
  return {
    position: t.position,
    bounds: {
      left: t.bounds.left,
      right: t.bounds.right + delta.x,
      top: t.bounds.top,
      bottom: t.bounds.bottom + delta.y,
    },
  }
}

export function resizeCanvasItemTransformInPlace(
  t: CanvasItemTransform,
  delta: Coordinates
): void {
  t.width += delta.x
  t.height += delta.y
  resizeTransformInPlace(t.local, delta)
  resizeTransformInPlace(t.global, delta)
}

export function resizeTransformInPlace(
  t: RectangleTransform,
  delta: Coordinates
): void {
  t.bounds.right += delta.x
  t.bounds.bottom += delta.y
}

export function add(a: Coordinates, b: Coordinates) {
  return { x: a.x + b.x, y: a.y + b.y }
}

export function subtract(a: Coordinates, b: Coordinates) {
  return { x: a.x - b.x, y: a.y - b.y }
}

export interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}

export interface Bounds {
  left: number
  right: number
  top: number
  bottom: number
}

export interface RectangleTransform {
  position: Coordinates
  bounds: Bounds
}

export function copyRectangleTransform(r: RectangleTransform) {
  return {
    position: { ...r.position },
    bounds: { ...r.bounds },
  }
}

export function copyCanvasItemTransform(t: CanvasItemTransform) {
  return {
    width: t.width,
    height: t.height,
    global: copyRectangleTransform(t.global),
    local: copyRectangleTransform(t.local),
  }
}

export function createRectangleTransform({
  cellRectangle,
  cellSize,
}: {
  cellRectangle: Rectangle
  cellSize: WidthHeight
}): RectangleTransform {
  const position = {
    x: cellRectangle.x * cellSize.width,
    y: cellRectangle.y * cellSize.height,
  }

  return {
    position,
    bounds: {
      left: position.x,
      right: position.x + cellRectangle.width * cellSize.width,
      top: position.y,
      bottom: position.y + cellRectangle.height * cellSize.height,
    },
  }
}

export function createCanvasItemTransform({
  cellRectangle,
  cellSize,
  containingGroupCellPosition,
}: {
  cellRectangle: Rectangle
  cellSize: WidthHeight
  containingGroupCellPosition?: Coordinates
}): CanvasItemTransform {
  const local = createRectangleTransform({ cellRectangle, cellSize })

  let global
  if (containingGroupCellPosition) {
    const globalCellRectangle = {
      x: cellRectangle.x + containingGroupCellPosition.x,
      y: cellRectangle.y + containingGroupCellPosition.y,
      width: cellRectangle.width,
      height: cellRectangle.height,
    }
    global = createRectangleTransform({
      cellRectangle: globalCellRectangle,
      cellSize,
    })
  } else {
    global = local
  }

  return {
    local,
    global,
    width: cellRectangle.width * cellSize.width,
    height: cellRectangle.height * cellSize.height,
  }
}

export interface SharedCanvasItem {
  id: string
  transform: CanvasItemTransform

  showIcon: boolean
  iconHtml: string
  iconSize: number
  iconFill: string

  title: string
  color: string
  bold: boolean
  italic: boolean
  underline: boolean
  fontSize: number
  textAlignment: AlignmentT

  borderWidth: number
  borderColor: string
  borderRadius: number

  background: string
  shadow: boolean
}

export type GroupItem = {
  type: 'group'

  maxItemRight: number
  maxItemBottom: number
} & SharedCanvasItem

export type LinkItem = {
  type: 'link'

  groupId: string | null
  url: string
  growOnHover: boolean
} & SharedCanvasItem

export interface Coordinates {
  x: number
  y: number
}

export interface RectSize {
  width: number
  height: number
}

export function isOverlapping(t1: Bounds, t2: Bounds) {
  return (
    t1.right > t2.left &&
    t1.left < t2.right &&
    t1.bottom > t2.top &&
    t1.top < t2.bottom
  )
}

export function isFullyInside(target: Bounds, container: Bounds) {
  return (
    container.left <= target.left &&
    target.right <= container.right &&
    container.top <= target.top &&
    target.bottom <= container.bottom
  )
}
