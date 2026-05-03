import type { ItemsContextValue, ItemsT } from '@/components/itemsContext'
import type { SelectionContextValue } from '@/components/Selection/selectionContext'
import {
  add,
  isFullyInside,
  isOverlapping,
  moveTransform,
  resizeCanvasItemTransform,
  subtract,
  type CanvasItem,
  type CanvasItemTransform,
  type Coordinates,
  type GroupItem,
  type RectangleTransform,
  type WidthHeight,
} from '@/lib/canvas'

export const snapRound = (x: number, cellSize: number) =>
  Math.round(x / cellSize) * cellSize

export function updateGroupMaxItemsDimensions({
  groupId,
  itemsContext,
}: {
  groupId: string
  itemsContext: ItemsContextValue
}) {
  itemsContext.updateItems((items) => {
    // Note need to recalculate inside updater, to get up-to-date data
    const maxDimensions = Object.values(items)
      .filter((item) => item.type === 'link' && item.groupId === groupId)
      .map((item) => ({
        right: item.transform.local.bounds.right,
        bottom: item.transform.local.bounds.bottom,
      }))
      .reduce(
        (a, b) => ({
          right: Math.max(a.right, b.right),
          bottom: Math.max(a.bottom, b.bottom),
        }),
        { right: 0, bottom: 0 }
      )

    const groupToUpdate = items[groupId] as GroupItem
    groupToUpdate.maxItemRight = maxDimensions.right
    groupToUpdate.maxItemBottom = maxDimensions.bottom
  })
}

export function moveAndResolveCollisions({
  allItems,
  delta,
  selection,
  isChangingParentGroupAllowed,
  snapToGrid,
  cellSize,
}: {
  allItems: CanvasItem[]
  delta: Coordinates
  selection: SelectionContextValue
  isChangingParentGroupAllowed: boolean
  snapToGrid: boolean
  cellSize: WidthHeight
}): {
  isIntersectingAtLeastOneItem: boolean
  fullyInsideSingleGroupId: string | null
  updatedGlobalTransforms: Map<string, RectangleTransform>
  finalDeltas: Map<string, Coordinates>
} {
  let isIntersectingAtLeastOneItem = false
  let fullyInsideSingleGroupId: string | null = null

  let isAvailbleToBePlacedInsideGroup = isChangingParentGroupAllowed

  const updatedGlobalTransforms: Map<string, RectangleTransform> = new Map()
  const finalDeltas: Map<string, Coordinates> = new Map()

  const alignedDelta = {
    x: snapRound(delta.x, cellSize.width),
    y: snapRound(delta.y, cellSize.height),
  }

  selection.selectedItems.forEach((selectedItem) => {
    let finalDelta = delta

    if (snapToGrid) {
      const currentPosition = selectedItem.transform.global.position
      const alignedPosition = {
        x: snapRound(currentPosition.x, cellSize.width),
        y: snapRound(currentPosition.y, cellSize.height),
      }

      const finalPosition = add(alignedPosition, alignedDelta)
      finalDelta = subtract(finalPosition, currentPosition)
    }

    finalDeltas.set(selectedItem.id, finalDelta)

    const selectedItemGlobalTransform = moveTransform(
      selectedItem.transform.global,
      finalDelta
    )

    updatedGlobalTransforms.set(selectedItem.id, selectedItemGlobalTransform)

    const overlappingItems = allItems.filter(
      (item) =>
        // ignore all selected items
        !selection.isSelected(item.id) &&
        // ignore if item is not selected, but is grouped inside of one of the selected groups
        !(
          item.type === 'link' &&
          item.groupId &&
          selection.isSelected(item.groupId)
        ) &&
        // overlap everything else
        isOverlapping(
          selectedItemGlobalTransform.bounds,
          item.transform.global.bounds
        )
    )

    if (overlappingItems.length > 0) {
      isIntersectingAtLeastOneItem = true
    }

    const firstOverlappingItem = overlappingItems[0]

    if (
      isAvailbleToBePlacedInsideGroup &&
      overlappingItems.length === 1 &&
      firstOverlappingItem.type === 'group' &&
      (fullyInsideSingleGroupId === firstOverlappingItem.id ||
        fullyInsideSingleGroupId === null) &&
      isFullyInside(
        selectedItemGlobalTransform.bounds,
        firstOverlappingItem.transform.global.bounds
      )
    ) {
      fullyInsideSingleGroupId = firstOverlappingItem.id
    } else {
      fullyInsideSingleGroupId = null
      isAvailbleToBePlacedInsideGroup = false
    }
  })

  if (!isAvailbleToBePlacedInsideGroup) {
    fullyInsideSingleGroupId = null
  }

  return {
    isIntersectingAtLeastOneItem,
    fullyInsideSingleGroupId,
    updatedGlobalTransforms,
    finalDeltas,
  }
}

const findOverlappingItemsIdsWhenResizing = (
  item: CanvasItem,
  items: ItemsT,
  newTransform: CanvasItemTransform
) => {
  const overlappingItemsIds = new Set(
    Object.values(items)
      .filter(
        (iItem) =>
          // ignore if overlapping itself
          iItem.id !== item.id &&
          // ignore if is a group and overlapping containing item
          !(iItem.type === 'link' && iItem.groupId === item.id) &&
          // overlap everything else
          isOverlapping(
            iItem.transform.global.bounds,
            newTransform.global.bounds
          )
      )
      .map((iItem) => iItem.id)
  )

  // if only overlapping a containing group that is also fully inside of
  if (item.type === 'link') {
    const containingGroup = item.groupId ? items[item.groupId] : null

    if (
      containingGroup &&
      isFullyInside(
        newTransform.global.bounds,
        containingGroup.transform.global.bounds
      ) &&
      overlappingItemsIds.has(containingGroup.id)
    ) {
      return new Set(
        [...overlappingItemsIds].filter((iId) => iId !== containingGroup.id)
      )
    }
  }

  return overlappingItemsIds
}

export function resizeAndResolveCollisions({
  item,
  items,
  delta,
  snapToGrid,
  cellSize,
}: {
  item: CanvasItem
  items: ItemsT
  delta: Coordinates & WidthHeight
  snapToGrid: boolean
  cellSize: WidthHeight
}) {
  const newWidthHeight = snapToGrid
    ? {
        width: snapRound(item.transform.width + delta.width, cellSize.width),
        height: snapRound(
          item.transform.height + delta.height,
          cellSize.height
        ),
      }
    : {
        width: item.transform.width + delta.width,
        height: item.transform.height + delta.height,
      }

  const finalDelta = {
    x: newWidthHeight.width - item.transform.width,
    y: newWidthHeight.height - item.transform.height,
  }

  const newTransform = resizeCanvasItemTransform(item.transform, finalDelta)

  const newOverlappingItemsIds = findOverlappingItemsIdsWhenResizing(
    item,
    items,
    newTransform
  )

  return {
    newTransform,
    newOverlappingItemsIds,
    finalDelta,
  }
}
