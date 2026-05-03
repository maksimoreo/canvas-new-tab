import { AppMode } from '@/components/App/AppContext'

declare global {
  interface Window {
    setAppMode: (appMode: AppMode) => void
    toggleAppMode: () => void
  }
}
