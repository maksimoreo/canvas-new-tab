import { isOverlapping, type Coordinates } from '@/lib/canvas'
import { areSetsEqual, ensure } from '@/lib/utils'
import { useRef, type MouseEventHandler } from 'react'
import { useSelection } from '../Selection/selectionContext'
import { useItemsContext } from '../itemsContext'

export default function useRectangleSelect() {
  const selection = useSelection()
  const itemsContext = useItemsContext()

  const isActiveRef = useRef(false)
  const operationRef = useRef<{
    element: HTMLElement
    firstClickPosition: Coordinates
    originalSelectedIds: string[]
  }>(null)

  const handleMouseMove = (event: MouseEvent) => {
    if (!isActiveRef.current) return

    const operation = ensure(operationRef.current)
    const { element, firstClickPosition, originalSelectedIds } = operation

    let left: number
    let top: number
    let width: number
    let height: number

    if (event.clientX >= firstClickPosition.x) {
      left = firstClickPosition.x
      width = event.clientX - firstClickPosition.x
    } else {
      left = event.clientX
      width = firstClickPosition.x - event.clientX
    }

    if (event.clientY >= firstClickPosition.y) {
      top = firstClickPosition.y
      height = event.clientY - firstClickPosition.y
    } else {
      top = event.clientY
      height = firstClickPosition.y - event.clientY
    }

    element.style.left = `${left}px`
    element.style.top = `${top}px`
    element.style.width = `${width}px`
    element.style.height = `${height}px`

    // Selection
    const offsetX = window.innerWidth / 2
    const offsetY = window.innerHeight / 2
    const bounds = {
      left: left - offsetX,
      top: top - offsetY,
      right: left + width - offsetX,
      bottom: top + height - offsetY,
    }

    const overlappingItemsIds = new Set(
      Object.values(itemsContext.items)
        .filter((item) => isOverlapping(item.transform.global.bounds, bounds))
        .map((item) => item.id)
        .concat([...originalSelectedIds])
    )

    selection.setSelectedItemsIds((selectedItemsIds) => {
      if (areSetsEqual(new Set(selectedItemsIds), overlappingItemsIds)) {
        return selectedItemsIds
      } else {
        return [...overlappingItemsIds]
      }
    })
  }

  const handleMouseUp = () => {
    isActiveRef.current = false

    removeEventListener('mousemove', handleMouseMove)
    removeEventListener('mouseup', handleMouseUp)

    const operation = ensure(operationRef.current)
    operation.element.style.display = 'none'

    operationRef.current = null
  }

  const handleMouseDown: MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault()

    let originalSelectedIds: string[]
    if (event.shiftKey) {
      originalSelectedIds = [...selection.selectedItemsIdsSet]
    } else {
      originalSelectedIds = []
      selection.deselectAll()
    }

    isActiveRef.current = true

    addEventListener('mousemove', handleMouseMove)
    addEventListener('mouseup', handleMouseUp)

    const element = ensure(
      document.querySelector('#rectangle-select') as HTMLElement
    )
    element.style.display = 'block'
    element.style.left = `0px`
    element.style.top = `0px`
    element.style.width = `0px`
    element.style.height = `0px`

    operationRef.current = {
      element,
      firstClickPosition: {
        x: event.clientX,
        y: event.clientY,
      },
      originalSelectedIds,
    }
  }

  return {
    handleMouseDown,
  }
}
