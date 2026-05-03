import { useEffect, useState } from 'react'
import Editor from '@/components/editor/Editor'
import Present from '@/components/present/Present'
import useKeybind from '@/hooks/useKeybind'
import { AppContext, type AppMode } from '@/components/App/AppContext'

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('present')

  useKeybind({
    code: 'Backquote',
    onDown: () => {
      setAppMode(appMode === 'editor' ? 'present' : 'editor')
    },
  })

  useEffect(() => {
    window.setAppMode = setAppMode
    window.toggleAppMode = () => {
      setAppMode((appMode) => (appMode === 'editor' ? 'present' : 'editor'))
    }
  }, [setAppMode])

  return (
    <AppContext.Provider value={{ appMode, setAppMode }}>
      {appMode === 'editor' ? <Editor /> : <Present />}
    </AppContext.Provider>
  )
}
