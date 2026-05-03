import { useState, type PropsWithChildren } from 'react'
import { ModificationsContext } from './ModificationsContext'

export default function ModificationsContextProvider({
  children,
}: PropsWithChildren) {
  const [enableSnapToGrid, setEnableSnapToGrid] = useState(false)
  const [overlappingItemsIds, setOverlappingItemsIds] = useState<Set<string>>(
    new Set()
  )
  const [isIntersectingAtLeastOneItem, setIsIntersectingAtLeastOneItem] =
    useState(false)
  const [fullyInsideSingleGroupId, setFullyInsideSingleGroupId] = useState<
    string | null
  >(null)

  return (
    <ModificationsContext.Provider
      value={{
        enableSnapToGrid,
        setEnableSnapToGrid,
        overlappingItemsIds,
        setOverlappingItemsIds,
        isIntersectingAtLeastOneItem,
        setIsIntersectingAtLeastOneItem,
        fullyInsideSingleGroupId,
        setFullyInsideSingleGroupId,
      }}
    >
      {children}
    </ModificationsContext.Provider>
  )
}
