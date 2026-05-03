import type { Bounds, Coordinates, WidthHeight } from '@/lib/canvas'
import { clamp, ensure } from '@/lib/utils'
import type { EditorWindowControls } from '../editorContext'

const HORIZONTAL_GAP_FROM_ITEM = 10
const HORIZONTAL_GAP_FROM_WINDOW_BORDER = 10
const VERTICAL_GAP_FROM_ITEM = 10
const VERTICAL_GAP_FROM_WINDOW_BORDER = 10

export function findBestWindowPosition({
  itemsBounds,
  windowSize,
}: {
  itemsBounds: Bounds[]
  windowSize: WidthHeight
}): Coordinates {
  if (itemsBounds.length == 0) {
    return {
      x: (window.innerWidth - windowSize.width) / 2,
      y: (window.innerHeight - windowSize.height) / 2,
    }
  }

  const firstItemBounds = ensure(itemsBounds[0])

  const usedArea = itemsBounds.reduce(
    (agg, itemBounds) => {
      return {
        left: Math.min(agg.left, itemBounds.left),
        right: Math.max(agg.right, itemBounds.right),
        top: Math.min(agg.top, itemBounds.top),
        bottom: Math.max(agg.bottom, itemBounds.bottom),
      }
    },
    {
      left: firstItemBounds.left,
      right: firstItemBounds.right,
      top: firstItemBounds.top,
      bottom: firstItemBounds.bottom,
    }
  )

  const usedAreaWidth = usedArea.right - usedArea.left
  const usedAreaHeight = usedArea.bottom - usedArea.top

  // light todo:
  // right now usedArea rectangle is considered fully used
  // Algorithm can be enhanced: in usedArea there can be places where placing window would not overlap any items

  const halfInnerWidth = window.innerWidth / 2
  const halfInnerHeight = window.innerHeight / 2

  const centerUsedAreaX =
    halfInnerWidth + usedArea.left + (usedAreaWidth - windowSize.width) / 2
  const centerUsedAreaY =
    halfInnerHeight + usedArea.top + (usedAreaHeight - windowSize.height) / 2

  const maxX = window.innerWidth - windowSize.width
  const maxY = window.innerHeight - windowSize.height

  const defaultX =
    // most likely true all the time
    windowSize.width < window.innerWidth
      ? clamp(centerUsedAreaX, 0, maxX)
      : centerUsedAreaX

  const defaultY =
    // most likely true all the time
    windowSize.width < window.innerWidth
      ? clamp(centerUsedAreaY, 0, maxY)
      : centerUsedAreaY

  const requiredWindowWidth =
    windowSize.width +
    HORIZONTAL_GAP_FROM_ITEM +
    HORIZONTAL_GAP_FROM_WINDOW_BORDER
  const requiredWindowHeight =
    windowSize.height + VERTICAL_GAP_FROM_ITEM + VERTICAL_GAP_FROM_WINDOW_BORDER

  if (
    halfInnerWidth + usedArea.right + requiredWindowWidth <=
    window.innerWidth
  ) {
    // if there is space on the right, place editor in the middle on the right
    return {
      x: halfInnerWidth + usedArea.right + HORIZONTAL_GAP_FROM_ITEM,
      y: defaultY,
    }
  } else if (halfInnerWidth + usedArea.left - requiredWindowWidth >= 0) {
    // else if there is space on the left, place editor in the middle on the left
    return {
      x:
        halfInnerWidth +
        usedArea.left -
        windowSize.width -
        HORIZONTAL_GAP_FROM_ITEM,
      y: defaultY,
    }
  } else if (
    halfInnerHeight + usedArea.bottom + requiredWindowHeight <=
    window.innerHeight
  ) {
    // else if there is space at the bottom, place editor in the middle at the bottom
    return {
      x: defaultX,
      y: halfInnerHeight + usedArea.bottom + VERTICAL_GAP_FROM_ITEM,
    }
  } else if (halfInnerHeight + usedArea.top - requiredWindowHeight >= 0) {
    // else if there is space at the top, place editor in the middle at the top
    return {
      x: defaultX,
      y:
        halfInnerHeight +
        usedArea.top -
        windowSize.height -
        VERTICAL_GAP_FROM_ITEM,
    }
  } else {
    // else place editor in the corner
    return {
      x:
        window.innerWidth -
        windowSize.width -
        HORIZONTAL_GAP_FROM_WINDOW_BORDER,
      y:
        window.innerHeight -
        windowSize.height -
        VERTICAL_GAP_FROM_WINDOW_BORDER,
    }
  }
}

export function openEditorForItemsBounds({
  editor,
  itemsBounds,
}: {
  editor: EditorWindowControls
  itemsBounds: Bounds[]
}) {
  const position = findBestWindowPosition({
    itemsBounds,
    windowSize: editor.size,
  })
  editor.setPosition(position)
  editor.open()
}
