import { useGrid } from '@/components/gridContext'
import { useItemsContext } from '@/components/itemsContext'
import type { ResizeEvent, ResizeStartEvent } from '@/components/resizeContext'
import {
  resizeCanvasItemTransformInPlace,
  type Coordinates,
  type WidthHeight,
} from '@/lib/canvas'
import { useRef } from 'react'
import {
  resizeAndResolveCollisions,
  updateGroupMaxItemsDimensions,
} from './canvasHelpers'
import { useSelection } from '@/components/Selection/selectionContext'
import { updateSelectionBoxTransform } from '@/components/SelectionBox/selectionBoxHelpers'
import { areSetsEqual, ensure } from '@/lib/utils'
import { useModificationsContext } from '@/components/ModificationsContext/ModificationsContext'
import { useChanges } from '@/components/ChangesContext/ChangesContext'

export type ResizeDelta = Coordinates & WidthHeight

export function useResize() {
  const itemsContext = useItemsContext()
  const selection = useSelection()
  const modificationsContext = useModificationsContext()
  const { cellSize } = useGrid()
  const { commitAllChanges } = useChanges()

  const isActiveRef = useRef(false)

  const operationRef = useRef<{
    delta: ResizeDelta
    id: string
    resizeElement: HTMLElement
    selectionBoxElement: HTMLElement | undefined
  }>(null)

  const onChange = ({ snapToGrid }: { snapToGrid: boolean }) => {
    if (!isActiveRef.current) {
      return
    }

    const operation = ensure(operationRef.current)
    const { id, delta, resizeElement, selectionBoxElement } = operation

    const item = itemsContext.items[id]
    const { newTransform, newOverlappingItemsIds } = resizeAndResolveCollisions(
      {
        item,
        items: itemsContext.items,
        delta,
        snapToGrid,
        cellSize,
      }
    )

    resizeElement.style.width = `${newTransform.width}px`
    resizeElement.style.height = `${newTransform.height}px`

    if (selectionBoxElement) {
      updateSelectionBoxTransform({
        selectionBoxElement,
        width: newTransform.width,
        height: newTransform.height,
      })
    }

    if (
      !areSetsEqual(
        newOverlappingItemsIds,
        modificationsContext.overlappingItemsIds
      )
    ) {
      modificationsContext.setOverlappingItemsIds(newOverlappingItemsIds)
    }
  }

  //

  const onStart = (event: ResizeStartEvent) => {
    isActiveRef.current = true

    const id = event.id

    operationRef.current = {
      id,
      delta: { x: 0, y: 0, width: 0, height: 0 },
      resizeElement: event.resizeCallbackParams.elementRef,
      selectionBoxElement: selection.selectionBoxRefsMap.current.get(id),
    }
  }

  const onChangeSnapToGrid = (snapToGrid: boolean) => {
    onChange({ snapToGrid })
  }

  const onMove = (event: ResizeEvent) => {
    const rawDelta = event.resizeCallbackParams.delta

    const operation = ensure(operationRef.current)
    operation.delta = {
      x: 0,
      y: 0,
      width: rawDelta.width,
      height: rawDelta.height,
    }

    onChange({ snapToGrid: modificationsContext.enableSnapToGrid })
  }

  const onStop = (event: ResizeEvent) => {
    isActiveRef.current = false

    const { id } = event
    const rawDelta = event.resizeCallbackParams.delta
    const delta = {
      x: 0,
      y: 0,
      width: rawDelta.width,
      height: rawDelta.height,
    }

    const item = itemsContext.items[id]
    const { newOverlappingItemsIds, finalDelta } = resizeAndResolveCollisions({
      item,
      items: itemsContext.items,
      delta,
      snapToGrid: modificationsContext.enableSnapToGrid,
      cellSize,
    })

    if (newOverlappingItemsIds.size === 0) {
      itemsContext.updateItem(id, (item) => {
        resizeCanvasItemTransformInPlace(item.transform, finalDelta)
      })

      if (item.type === 'link' && item.groupId) {
        updateGroupMaxItemsDimensions({ groupId: item.groupId, itemsContext })
      }

      commitAllChanges()
    } else {
      const operation = ensure(operationRef.current)
      const { selectionBoxElement } = operation

      if (selectionBoxElement) {
        updateSelectionBoxTransform({
          selectionBoxElement,
          width: item.transform.width,
          height: item.transform.height,
        })
      }
    }

    modificationsContext.setOverlappingItemsIds(new Set())
  }

  return {
    isActiveRef,
    onStart,
    onMove,
    onChangeSnapToGrid,
    onStop,
  }
}
