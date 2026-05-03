import { useRef, useState, type PropsWithChildren } from 'react'
import { SelectionContext } from './selectionContext'
import { useItemsContext } from '../itemsContext'

export default function SelectionContextProvider({
  children,
}: PropsWithChildren) {
  const [selectedItemsIds, setSelectedItemsIds] = useState<string[]>([])

  const { items } = useItemsContext()

  const selectionBoxRefsMap = useRef<Map<string, HTMLDivElement>>(new Map())

  const selectedItemsIdsSet = new Set(selectedItemsIds)

  // cached values
  const selectedItems = selectedItemsIds.map((id) => items[id])
  const containsLink = selectedItems.some((item) => item.type === 'link')
  const containsGroup = selectedItems.some((item) => item.type === 'group')
  const containsLinkWithSelectedParentGroup = selectedItems.some(
    (item) =>
      item.type === 'link' &&
      item.groupId &&
      selectedItemsIdsSet.has(item.groupId)
  )
  const containsLinkWithParentGroup = selectedItems.some(
    (item) => item.type === 'link' && item.groupId
  )
  const containsLinkWithoutParentGroup = selectedItems.some(
    (item) => item.type === 'link' && !item.groupId
  )
  const selectedItemsParentGroupIds = selectedItems.reduce<Set<string>>(
    (acc, item) => {
      if (item.type === 'link' && item.groupId) {
        acc.add(item.groupId)
      }
      return acc
    },
    new Set<string>()
  )

  return (
    <SelectionContext.Provider
      value={{
        selectedItemsIds,
        setSelectedItemsIds,
        selectedItemsIdsSet,
        selectedItems,
        containsLink,
        containsGroup,
        containsLinkWithSelectedParentGroup,
        containsLinkWithParentGroup,
        containsLinkWithoutParentGroup,
        selectedItemsParentGroupIds,
        selectionBoxRefsMap,
      }}
    >
      {children}
    </SelectionContext.Provider>
  )
}
