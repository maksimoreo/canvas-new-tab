import { createContext, useContext } from 'react'

export type AppMode = 'present' | 'editor'

export interface AppContextValue {
  appMode: AppMode
  setAppMode: (appMode: AppMode) => void
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useAppMode() {
  const appContext = useContext(AppContext)

  if (!appContext) {
    throw new Error('useAppMode can only be used inside AppContext')
  }

  return appContext
}
