import { useDraggable } from '@dnd-kit/core'
import clsx from 'clsx'
import { Resizable, type ResizeCallback } from 're-resizable'
import { type PropsWithChildren } from 'react'
import { type EditorWindowControls } from '@/components/editorContext'
import useKeybind from '@/hooks/useKeybind'

export default function Window({
  children,
  title,
  editor,
}: PropsWithChildren<{
  title: string
  editor: EditorWindowControls
}>) {
  const { id, position, size } = editor

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      top: position.y,
      bottom: position.y + size.height,
      left: position.x,
      right: position.x + size.width,
    },
  })

  const handleResizeStop: ResizeCallback = (_event, _direction, element) => {
    editor.setSize({
      width: parseInt(element.style.width),
      height: parseInt(element.style.height),
    })
  }

  useKeybind({
    code: 'Escape',
    onDown: editor.close,
  })

  const styleTransform = transform
    ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
    : undefined

  return (
    <div
      className="absolute"
      style={{
        transform: styleTransform,
        left: position.x,
        top: position.y,
        zIndex: 400,
      }}
    >
      <Resizable
        className={clsx(
          'rounded-lg flex flex-col shadow-md border bg-neutral-100 dark:bg-neutral-900 dark:border-neutral-700',
        )}
        minWidth={400}
        minHeight={300}
        size={size}
        onResizeStop={handleResizeStop}
      >
        <div className="flex">
          <button
            ref={setNodeRef}
            className="min-w-16 grow mx-2"
            {...attributes}
            {...listeners}
          >
            {title}
          </button>

          <button
            className="bg-red-500 rounded-full m-2 w-4 h-4"
            onClick={editor.close}
          ></button>
        </div>

        <div className={clsx('min-w-32 min-h-8 grow')}>{children}</div>
      </Resizable>
    </div>
  )
}
