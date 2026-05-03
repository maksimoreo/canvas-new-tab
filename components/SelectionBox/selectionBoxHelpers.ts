export const SELECTION_BOX_OFFSET = 6

export function updateSelectionBoxTransform({
  selectionBoxElement: { style },
  x,
  y,
  width,
  height,
}: {
  selectionBoxElement: HTMLElement
  x?: number
  y?: number
  width?: number
  height?: number
}) {
  if (x !== undefined) style.left = `${x - SELECTION_BOX_OFFSET}px`
  if (y !== undefined) style.top = `${y - SELECTION_BOX_OFFSET}px`
  if (width !== undefined) style.width = `${width + SELECTION_BOX_OFFSET * 2}px`
  if (height !== undefined)
    style.height = `${height + SELECTION_BOX_OFFSET * 2}px`
}
