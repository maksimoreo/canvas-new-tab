import { createContext, useContext, type RefObject } from 'react'
import type { CanvasItem, GroupItem, LinkItem } from '@/lib/canvas'

export type ItemsT = Record<string, CanvasItem>

export interface ItemsContextValue {
  items: ItemsT
  setItems: React.Dispatch<React.SetStateAction<ItemsT>>
  addItem: (item: CanvasItem) => void
  updateItem: (id: string, updater: (item: CanvasItem) => void) => void
  updateItems: (updater: (items: ItemsT) => void) => void
  removeItem: (id: string) => void
  itemRefsMap: RefObject<Map<string, HTMLDivElement>>
}

export const ItemsContext = createContext<ItemsContextValue | null>(null)

export function useItemsContext() {
  const itemsContext = useContext(ItemsContext)

  if (!itemsContext) {
    throw new Error(
      'useItemsContext can only be used inside ItemsContextProvider component'
    )
  }

  return itemsContext
}

export function useCanvasItem(id: string) {
  const itemsContext = useContext(ItemsContext)

  if (!itemsContext) {
    throw new Error(
      'useItemsContext can only be used inside ItemsContextProvider component'
    )
  }

  return itemsContext.items[id]
}

export function useTypedCanvasItem<AsItemT>(
  id: string,
  type: 'link' | 'group'
): AsItemT {
  const item = useItemsContext().items[id]

  if (item.type !== type) {
    throw new Error('Invalid type')
  }

  return item as AsItemT
}

export const useLinkItem = (id: string) =>
  useTypedCanvasItem<LinkItem>(id, 'link')
export const useGroupItem = (id: string) =>
  useTypedCanvasItem<GroupItem>(id, 'group')
