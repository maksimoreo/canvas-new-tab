import type { Coordinates, WidthHeight } from '@/lib/canvas'
import { createContext, useContext } from 'react'

export type EditorWindowId = 'linkEditor' | 'groupEditor' | 'settingsEditor'

export interface EditorData {
  position: Coordinates
  size: WidthHeight
  view: string | null
}

export interface EditorWindowControls {
  id: EditorWindowId

  isOpened: boolean
  setIsOpened: (isOpened: boolean) => void
  open: () => void
  close: () => void
  toggle: () => void

  editorData: EditorData
  setEditorData: (editorData: EditorData) => void

  position: Coordinates
  setPosition: (position: Coordinates) => void

  size: WidthHeight
  setSize: (size: WidthHeight) => void
}

export interface EditorContextValue {
  // Editors
  linkEditor: EditorWindowControls
  groupEditor: EditorWindowControls
  settingsEditor: EditorWindowControls

  openedEditorId: EditorWindowId | null
  openedEditor: EditorWindowControls | null
  setOpenedEditorId: (editor: EditorWindowId | null) => void

  editorDatas: Record<EditorWindowId, EditorData>
  setEditorDatas: (editorDatas: Record<EditorWindowId, EditorData>) => void
}

export const EditorContext = createContext<EditorContextValue | null>(null)

export function useEditor() {
  const editorContext = useContext(EditorContext)

  if (!editorContext) {
    throw new Error('useEditor can only be used inside EditorContext')
  }

  return editorContext
}

export function useEditorItem(id: EditorWindowId) {
  return useEditor()[id]
}
