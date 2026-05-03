import { createContext, useContext } from 'react'

export interface ChangesContextValue {
  commitAllChanges: () => void
}

export const ChangesContext = createContext<ChangesContextValue | null>(null)

export function useChanges() {
  const changesContext = useContext(ChangesContext)

  if (!changesContext) {
    throw new Error(
      'useChanges can only be used inside ChangesContextProvider component'
    )
  }

  return changesContext
}
