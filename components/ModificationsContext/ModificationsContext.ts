import { createContext, useContext } from 'react'

export interface ModificationsContextValue {
  enableSnapToGrid: boolean
  setEnableSnapToGrid: (enableSnapToGrid: boolean) => void

  overlappingItemsIds: Set<string>
  setOverlappingItemsIds: (overlappingItemsIds: Set<string>) => void

  isIntersectingAtLeastOneItem: boolean
  setIsIntersectingAtLeastOneItem: (
    isIntersectingAtLeastOneItem: boolean
  ) => void

  fullyInsideSingleGroupId: string | null
  setFullyInsideSingleGroupId: (fullyInsideSingleGroupId: string | null) => void
}

export const ModificationsContext =
  createContext<ModificationsContextValue | null>(null)

export function useModificationsContext() {
  const modificationsContext = useContext(ModificationsContext)

  if (!modificationsContext) {
    throw new Error(
      'useModificationsContext can only be used inside ModificationsContextProvider component'
    )
  }

  return modificationsContext
}
