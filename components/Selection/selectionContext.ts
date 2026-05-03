import {
  createContext,
  useContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react'
import { useItemsContext } from '../itemsContext'
import { useEditor } from '../editorContext'
import type { CanvasItem } from '@/lib/canvas'

export interface SelectionContextValue_Internal {
  selectedItemsIds: string[]
  selectedItemsIdsSet: Set<string>
  setSelectedItemsIds: Dispatch<SetStateAction<string[]>>

  selectedItems: CanvasItem[]
  containsLink: boolean
  containsGroup: boolean
  containsLinkWithSelectedParentGroup: boolean
  containsLinkWithParentGroup: boolean
  containsLinkWithoutParentGroup: boolean
  selectedItemsParentGroupIds: Set<string>

  selectionBoxRefsMap: RefObject<Map<string, HTMLDivElement>>
}

export const SelectionContext =
  createContext<SelectionContextValue_Internal | null>(null)

export function useSelection() {
  const { items } = useItemsContext()
  const selectionContext = useContext(SelectionContext)
  const editor = useEditor()

  if (!selectionContext) {
    throw new Error('useSelection can only be used inside SelectionContext')
  }

  const { selectedItemsIds, setSelectedItemsIds, selectedItemsIdsSet } =
    selectionContext

  return {
    selectedItemsIds,
    setSelectedItemsIds,
    selectedItemsIdsSet,

    selectedItems: selectionContext.selectedItems,
    containsLink: selectionContext.containsLink,
    containsGroup: selectionContext.containsGroup,
    containsLinkWithSelectedParentGroup:
      selectionContext.containsLinkWithSelectedParentGroup,
    containsLinkWithParentGroup: selectionContext.containsLinkWithParentGroup,
    containsLinkWithoutParentGroup:
      selectionContext.containsLinkWithoutParentGroup,
    selectedItemsParentGroupIds: selectionContext.selectedItemsParentGroupIds,

    select: (itemOrId: string | CanvasItem) => {
      const id = typeof itemOrId === 'string' ? itemOrId : itemOrId.id

      setSelectedItemsIds(
        selectedItemsIds.filter((iid) => iid !== id).concat([id])
      )
    },
    deselect: (id: string) => {
      editor.setOpenedEditorId(null)
      setSelectedItemsIds(selectedItemsIds.filter((iid) => iid !== id))
    },
    selectAll: () => setSelectedItemsIds(Object.keys(items)),
    deselectAll: () => {
      if (
        editor.openedEditorId === 'linkEditor' ||
        editor.openedEditorId === 'groupEditor'
      ) {
        editor.setOpenedEditorId(null)
      }

      setSelectedItemsIds([])
    },
    isSelected: (id: string) => selectedItemsIdsSet.has(id),

    selectionBoxRefsMap: selectionContext.selectionBoxRefsMap,
  }
}

export type SelectionContextValue = ReturnType<typeof useSelection>
