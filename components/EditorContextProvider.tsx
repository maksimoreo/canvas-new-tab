import { useState, type PropsWithChildren } from 'react'
import {
  EditorContext,
  type EditorData,
  type EditorWindowControls,
  type EditorWindowId,
} from './editorContext'
import { type Coordinates, type WidthHeight } from '@/lib/canvas'
import { produce } from 'immer'

const initialEditorDatas = {
  linkEditor: {
    position: { x: 0, y: 0 },
    size: { width: 400, height: 300 },
    view: null,
  },
  groupEditor: {
    position: { x: 0, y: 0 },
    size: { width: 400, height: 300 },
    view: null,
  },
  settingsEditor: {
    position: { x: 50, y: 50 },
    size: { width: 600, height: 400 },
    view: null,
  },
}

export default function EditorContextProvider({ children }: PropsWithChildren) {
  const [openedEditorId, setOpenedEditorId] = useState<EditorWindowId | null>(
    null
  )
  const [editorDatas, setEditorDatas] =
    useState<Record<EditorWindowId, EditorData>>(initialEditorDatas)

  const createEditorWindowControls = (
    id: EditorWindowId
  ): EditorWindowControls => {
    const open = () => setOpenedEditorId(id)
    const close = () => setOpenedEditorId(null)

    const isOpened = openedEditorId === id

    return {
      id,

      isOpened,
      setIsOpened: (newIsOpened: boolean) => (newIsOpened ? open() : close()),
      open,
      close,
      toggle: () => (isOpened ? close() : open()),

      editorData: editorDatas[id],
      setEditorData: (editorData: EditorData) => {
        const newEditorDatas = { ...editorDatas }
        newEditorDatas[id] = editorData
        setEditorDatas(newEditorDatas)
      },

      position: editorDatas[id].position,
      setPosition: (position: Coordinates) =>
        setEditorDatas(
          produce((draft) => {
            draft[id].position = position
          })
        ),

      size: editorDatas[id].size,
      setSize: (size: WidthHeight) =>
        setEditorDatas(
          produce((draft) => {
            draft[id].size = size
          })
        ),
    }
  }

  const linkEditor = createEditorWindowControls('linkEditor')
  const groupEditor = createEditorWindowControls('groupEditor')
  const settingsEditor = createEditorWindowControls('settingsEditor')

  const editors = {
    linkEditor,
    groupEditor,
    settingsEditor,
  }

  const openedEditor = openedEditorId ? editors[openedEditorId] : null

  return (
    <EditorContext.Provider
      value={{
        linkEditor,
        groupEditor,
        settingsEditor,

        openedEditorId,
        openedEditor,
        setOpenedEditorId,

        editorDatas,
        setEditorDatas,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}
