import {
  calculateLocalTransform,
  moveTransformInPlace,
  type Bounds,
  type Coordinates,
  type LinkItem,
} from '@/lib/canvas'
import { useRef } from 'react'
import {
  moveAndResolveCollisions,
  updateGroupMaxItemsDimensions,
} from './canvasHelpers'
import { useItemsContext } from '@/components/itemsContext'
import { useSelection } from '@/components/Selection/selectionContext'
import { ensure } from '@/lib/utils'
import { useGrid } from '@/components/gridContext'
import { updateSelectionBoxTransform } from '@/components/SelectionBox/selectionBoxHelpers'
import { useModificationsContext } from '@/components/ModificationsContext/ModificationsContext'
import type { DragEndEvent, DragMoveEvent, DragStartEvent } from '@dnd-kit/core'
import { useEditor } from '@/components/editorContext'
import { useChanges } from '@/components/ChangesContext/ChangesContext'
import { openEditorForItemsBounds } from '@/components/EditorContext/findBestWindowPosition'

export function useMove() {
  const itemsContext = useItemsContext()
  const editor = useEditor()
  const selection = useSelection()
  const { cellSize } = useGrid()
  const modificationsContext = useModificationsContext()
  const { commitAllChanges } = useChanges()

  const deltaRef = useRef<Coordinates>({ x: 0, y: 0 })
  const isActiveRef = useRef(false)

  const isMovingItemsAllowed = !(
    // in any of these cases moving items is not allowed:
    // - if contains both grouped and non-grouped item (a group or a link without group)
    (
      (selection.containsLinkWithParentGroup &&
        (selection.containsGroup ||
          selection.containsLinkWithoutParentGroup)) ||
      // - if selected items are from different groups
      selection.selectedItemsParentGroupIds.size >= 2
    )
  )

  const isChangingParentGroupAllowed = !(
    // if selection contains group
    (
      selection.containsGroup ||
      // if movement is not allowed
      !isMovingItemsAllowed
    )
  )

  const handleMove = ({
    delta,
    snapToGrid,
  }: {
    delta: Coordinates
    snapToGrid: boolean
  }) => {
    // Sometimes, when releasing drag button while moving items, handleDragMove
    // receives call. This is easily reproducible when moving items around
    // quickly (put console.logs in handleMove and handleDragEnd functions).
    // I don't know why exactly it happens, and it is only fixable
    // when using ref (not state).
    if (!isActiveRef.current) {
      return
    }

    const resolveResult = moveAndResolveCollisions({
      allItems: Object.values(itemsContext.items),
      delta,
      selection,
      isChangingParentGroupAllowed,
      snapToGrid,
      cellSize,
    })

    selection.selectedItemsIds.forEach((selectedItemId) => {
      const item = itemsContext.items[selectedItemId]

      const newGlobalTransform = ensure(
        resolveResult.updatedGlobalTransforms.get(selectedItemId),
      )
      const newLocalTransform =
        item.type === 'link' && item.groupId
          ? calculateLocalTransform(
              newGlobalTransform,
              itemsContext.items[item.groupId].transform.global.position,
            )
          : newGlobalTransform

      const element = ensure(
        itemsContext.itemRefsMap.current.get(selectedItemId),
      )

      element.style.left = `${newLocalTransform.position.x}px`
      element.style.top = `${newLocalTransform.position.y}px`

      // Move selection box
      const selectionBoxElement = ensure(
        selection.selectionBoxRefsMap.current.get(selectedItemId),
      )
      updateSelectionBoxTransform({
        selectionBoxElement,
        x: newGlobalTransform.position.x,
        y: newGlobalTransform.position.y,
      })
    })

    modificationsContext.setIsIntersectingAtLeastOneItem(
      resolveResult.isIntersectingAtLeastOneItem,
    )
    modificationsContext.setFullyInsideSingleGroupId(
      resolveResult.fullyInsideSingleGroupId,
    )
  }

  // region interface

  const onStart = (event: DragStartEvent) => {
    isActiveRef.current = true
    deltaRef.current = { x: 0, y: 0 }

    const draggableId = event.active.id.toString()

    const pointerEvent = event.activatorEvent as PointerEvent

    if (pointerEvent.ctrlKey || pointerEvent.shiftKey) {
      selection.select(draggableId)
    } else if (!selection.isSelected(draggableId)) {
      selection.setSelectedItemsIds([draggableId])
    }

    // Close all editors when moving
    editor.setOpenedEditorId(null)
  }

  const onMove = (event: DragMoveEvent) => {
    if (!isMovingItemsAllowed) return

    handleMove({
      delta: event.delta,
      snapToGrid: modificationsContext.enableSnapToGrid,
    })

    deltaRef.current = { x: event.delta.x, y: event.delta.y }
  }

  const onChangeEnableSnapToGrid = (snapToGrid: boolean) => {
    handleMove({ delta: deltaRef.current, snapToGrid })
  }

  const onStop = (event: DragEndEvent) => {
    isActiveRef.current = false
    deltaRef.current = { x: 0, y: 0 }

    if (!isMovingItemsAllowed) {
      if (!selection.containsGroup) {
        openEditorForItemsBounds({
          editor: editor.linkEditor,
          itemsBounds: selection.selectedItems.map(
            (item) => item.transform.global.bounds,
          ),
        })
      } else if (!selection.containsLink) {
        openEditorForItemsBounds({
          editor: editor.groupEditor,
          itemsBounds: selection.selectedItems.map(
            (item) => item.transform.global.bounds,
          ),
        })
      }

      return
    }

    const draggableId = event.active.id.toString()

    const pointerEvent = event.activatorEvent as PointerEvent

    const { delta } = event

    if (delta.x == 0 && delta.y == 0) {
      if (pointerEvent.shiftKey || pointerEvent.ctrlKey) {
        // draggableId item was certainly selected in onStart
        console.assert(selection.isSelected(draggableId))

        // Editor was closed in onStart, open it again
        if (!selection.containsGroup) {
          openEditorForItemsBounds({
            editor: editor.linkEditor,
            itemsBounds: selection.selectedItems.map(
              (item) => item.transform.global.bounds,
            ),
          })
        } else if (!selection.containsLink) {
          openEditorForItemsBounds({
            editor: editor.groupEditor,
            itemsBounds: selection.selectedItems.map(
              (item) => item.transform.global.bounds,
            ),
          })
        }
      } else {
        selection.setSelectedItemsIds([draggableId])

        const newSelectedItem = itemsContext.items[draggableId]
        const bounds = newSelectedItem.transform.global.bounds

        if (newSelectedItem.type === 'link') {
          openEditorForItemsBounds({
            editor: editor.linkEditor,
            itemsBounds: [bounds],
          })
        } else if (newSelectedItem.type === 'group') {
          openEditorForItemsBounds({
            editor: editor.groupEditor,
            itemsBounds: [bounds],
          })
        }
      }

      return
    }

    // 1. Validate

    const resolveResult = moveAndResolveCollisions({
      allItems: Object.values(itemsContext.items),
      delta: event.delta,
      selection,
      isChangingParentGroupAllowed,
      snapToGrid: modificationsContext.enableSnapToGrid,
      cellSize,
    })

    const doCommit =
      (isChangingParentGroupAllowed &&
        resolveResult.fullyInsideSingleGroupId) ||
      !resolveResult.isIntersectingAtLeastOneItem

    if (!doCommit) {
      modificationsContext.setIsIntersectingAtLeastOneItem(false)
      modificationsContext.setFullyInsideSingleGroupId(null)

      selection.selectedItems.forEach((selectedItem) => {
        const element = ensure(
          itemsContext.itemRefsMap.current.get(selectedItem.id),
        )

        const localPosition = selectedItem.transform.local.position
        element.style.left = `${localPosition.x}px`
        element.style.top = `${localPosition.y}px`

        // Move selection box
        const selectionBoxElement = ensure(
          selection.selectionBoxRefsMap.current.get(selectedItem.id),
        )
        const globalPosition = selectedItem.transform.global.position
        updateSelectionBoxTransform({
          selectionBoxElement,
          x: globalPosition.x,
          y: globalPosition.y,
        })
      })

      return
    }

    // 2. Initialize
    const newGroup = resolveResult.fullyInsideSingleGroupId
      ? itemsContext.items[resolveResult.fullyInsideSingleGroupId]
      : null

    const previousGroupId = isChangingParentGroupAllowed
      ? (selection.selectedItems[0] as LinkItem).groupId
      : null

    const previousGroup = previousGroupId
      ? itemsContext.items[previousGroupId]
      : null

    const newItemsBounds: Bounds[] = []

    // 3. Commit
    itemsContext.updateItems((items) => {
      selection.selectedItemsIds.forEach((selectedItemId) => {
        const selectedItem = items[selectedItemId]
        const finalDelta = ensure(resolveResult.finalDeltas.get(selectedItemId))

        // Move global transform
        moveTransformInPlace(selectedItem.transform.global, finalDelta)

        newItemsBounds.push({ ...selectedItem.transform.global.bounds })

        // Assign new groupId
        if (!selection.containsGroup) {
          const selectedLinkItem = selectedItem as LinkItem

          selectedLinkItem.groupId = resolveResult.fullyInsideSingleGroupId
        }

        // Every item inside group changes its global transform
        if (selectedItem.type === 'group') {
          Object.values(items).forEach((itemForUpdate) => {
            if (
              itemForUpdate.type === 'link' &&
              itemForUpdate.groupId === selectedItem.id
            ) {
              moveTransformInPlace(itemForUpdate.transform.global, finalDelta)
            }
          })
        }
      })

      // Recalculate local transform
      selection.selectedItemsIds.forEach((selectedItemId) => {
        const selectedItem = items[selectedItemId]

        if (selectedItem.type !== 'link' || !selectedItem.groupId) {
          selectedItem.transform.local = selectedItem.transform.global
          return
        }

        const group = items[selectedItem.groupId]

        selectedItem.transform.local = calculateLocalTransform(
          selectedItem.transform.global,
          group.transform.global.position,
        )
      })
    })

    if (previousGroup) {
      updateGroupMaxItemsDimensions({ groupId: previousGroup.id, itemsContext })
    }

    if (newGroup && newGroup.id !== previousGroup?.id) {
      updateGroupMaxItemsDimensions({ groupId: newGroup.id, itemsContext })
    }

    if (!selection.containsGroup) {
      openEditorForItemsBounds({
        editor: editor.linkEditor,
        itemsBounds: newItemsBounds,
      })
    } else if (!selection.containsLink) {
      openEditorForItemsBounds({
        editor: editor.groupEditor,
        itemsBounds: newItemsBounds,
      })
    }

    modificationsContext.setFullyInsideSingleGroupId(null)
    modificationsContext.setIsIntersectingAtLeastOneItem(false)
    commitAllChanges()
    modificationsContext.setOverlappingItemsIds(new Set())
  }

  return {
    isActiveRef,
    onStart,
    onMove,
    onChangeEnableSnapToGrid,
    onStop,
  }
}
