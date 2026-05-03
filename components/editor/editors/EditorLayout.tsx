import { useMemo, useState, type JSX } from 'react'
import SidebarItem from './SidebarItem'
import { useEditor } from '@/components/editorContext'
import { ensure } from '@/lib/utils'

export default function EditorLayout<ViewIdT extends string>({
  defaultInitialView,
  items,
}: {
  defaultInitialView: ViewIdT
  items: { id: ViewIdT; title: string; component: JSX.Element }[]
}) {
  const editor = useEditor()
  const openedEditor = ensure(editor.openedEditor)

  const itemsIdsSet = useMemo(
    () => new Set(items.map((item) => item.id)),
    [items]
  )

  const currentView = openedEditor.editorData.view

  const initialView =
    currentView && itemsIdsSet.has(currentView as ViewIdT)
      ? (currentView as ViewIdT)
      : defaultInitialView

  const [selectedView, setSelectedView] = useState<ViewIdT>(initialView)

  // todo: create lookup with useMemo ?
  const component = items.find((item) => item.id === selectedView)?.component

  return (
    <div className="flex flex-row h-full">
      <div className="min-w-32 w-32 bg-neutral-200 rounded-bl-md pt-2 overflow-y-auto overflow-x-hidden dark:bg-neutral-900">
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            title={item.title}
            selected={selectedView === item.id}
            onClick={() => {
              setSelectedView(item.id)
              openedEditor.setEditorData({
                ...openedEditor.editorData,
                view: item.id,
              })
            }}
          />
        ))}
      </div>

      <div className="flex-grow bg-white rounded-br-md overflow-y-auto dark:bg-black">
        {component}
      </div>
    </div>
  )
}
