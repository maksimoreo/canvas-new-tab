import { useRef, useState, type PropsWithChildren } from 'react'
import { ItemsContext, type ItemsT } from './itemsContext'
import type { CanvasItem } from '@/lib/canvas'
import { produce } from 'immer'

export default function ItemsContextProvider({
  children,
  initialItems,
}: PropsWithChildren<{ initialItems?: ItemsT }>) {
  const [items, setItems] = useState<ItemsT>(initialItems ?? {})
  const itemRefsMap = useRef<Map<string, HTMLDivElement>>(new Map())

  const addItem = (item: CanvasItem) => {
    setItems(
      produce((draft) => {
        draft[item.id] = item
      })
    )
  }

  const updateItem = (id: string, updater: (item: CanvasItem) => void) => {
    setItems(
      produce((draft) => {
        const item = draft[id] as CanvasItem
        updater(item)
      })
    )
  }

  const updateItems = (updater: (items: ItemsT) => void) =>
    setItems(produce((draft) => updater(draft)))

  const removeItem = (id: string) => {
    setItems(
      produce((draft) => {
        delete draft[id]
      })
    )
  }

  return (
    <ItemsContext.Provider
      value={{
        items,
        setItems,
        addItem,
        updateItem,
        updateItems,
        removeItem,
        itemRefsMap,
      }}
    >
      {children}
    </ItemsContext.Provider>
  )
}
