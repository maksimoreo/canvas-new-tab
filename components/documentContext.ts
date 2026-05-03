import { createContext, useContext } from 'react'

export interface DocumentContextValue {
  background: string
  setBackground: (background: string) => void

  fontFamily: string
  setFontFamily: (fontFamily: string) => void

  showEditorModeButton: boolean
  setShowEditorModeButton: (showEditorModeButton: boolean) => void
}

export const DocumentContext = createContext<DocumentContextValue | null>(null)

export function useDocumentContext() {
  const documentContext = useContext(DocumentContext)

  if (!documentContext) {
    throw new Error(
      'useDocumentContext can only be used inside DocumentContextProvider component'
    )
  }

  return documentContext
}
