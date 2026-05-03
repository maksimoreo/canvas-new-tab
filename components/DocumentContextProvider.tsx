import { useState, type PropsWithChildren } from 'react'
import { DocumentContext } from './documentContext'

export default function DocumentContextProvider({
  children,
  initialBackground,
  initialFontFamily,
  initialShowEditorModeButton,
}: PropsWithChildren<{
  initialBackground: string
  initialFontFamily: string
  initialShowEditorModeButton: boolean
}>) {
  const [background, setBackground] = useState(initialBackground)
  const [fontFamily, setFontFamily] = useState(initialFontFamily)
  const [showEditorModeButton, setShowEditorModeButton] = useState(
    initialShowEditorModeButton
  )

  return (
    <DocumentContext.Provider
      value={{
        background,
        setBackground,
        fontFamily,
        setFontFamily,
        showEditorModeButton,
        setShowEditorModeButton,
      }}
    >
      {children}
    </DocumentContext.Provider>
  )
}
