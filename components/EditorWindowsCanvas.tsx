import Window from '@/components/Window'
import { useEditor } from './editorContext'
import { DndContext, type Modifier } from '@dnd-kit/core'
import LinkEditor from '@/components/editor/editors/LinkEditor'
import GroupEditor from '@/components/editor/editors/GroupEditor/GroupEditor'
import SettingsEditor from '@/components/editor/editors/SettingsEditor/SettingsEditor'
import { restrictToBoundingRect } from '@/lib/restrictToBoundingRect'
import { ensure } from '@/lib/utils'

const restrictWindow: Modifier = ({
  active,
  transform,
  windowRect,
  draggingNodeRect,
}) => {
  if (!active || !windowRect || !draggingNodeRect) return transform

  // input.draggingNodeRect is rectangle of a draggable handle, which is
  // smaller than object that this handle controls.
  // instead, we use correct rectangle info that we defined in
  // useDraggable({ data: ... })

  const data = ensure(active.data.current)

  const rect = {
    top: data.top,
    bottom: data.bottom,
    left: data.left,
    right: data.right,
    width: data.right - data.left,
    height: data.bottom - data.top,
  }
  return restrictToBoundingRect(transform, rect, windowRect)
}

export default function EditorWindowsCanvas() {
  const { openedEditor } = useEditor()

  return (
    <DndContext
      onDragEnd={(event) => {
        ensure(openedEditor)

        openedEditor!.setPosition({
          x: openedEditor!.position.x + event.delta.x,
          y: openedEditor!.position.y + event.delta.y,
        })
      }}
      modifiers={[restrictWindow]}
      autoScroll={false}
    >
      {openedEditor ? (
        openedEditor.id === 'linkEditor' ? (
          <Window editor={openedEditor} title="Link Editor">
            <LinkEditor />
          </Window>
        ) : openedEditor.id === 'groupEditor' ? (
          <Window editor={openedEditor} title="Group Editor">
            <GroupEditor />
          </Window>
        ) : openedEditor.id === 'settingsEditor' ? (
          <Window editor={openedEditor} title="Settings">
            <SettingsEditor />
          </Window>
        ) : null
      ) : null}
    </DndContext>
  )
}
