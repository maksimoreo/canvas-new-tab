import { useDraggable } from '@dnd-kit/core'
import clsx from 'clsx'
import { Resizable } from 're-resizable'
import { type PropsWithChildren } from 'react'
import { useItemsContext, useGroupItem } from '@/components/itemsContext'
import LinkView from './LinkView'
import { useGrid } from '@/components/gridContext'
import { useResizeContext } from '@/components/resizeContext'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { cn } from '@/lib/utils'
import { getFlexAlignmentClasses } from '@/lib/alignment'
import { useChanges } from '@/components/ChangesContext/ChangesContext'
import { useSelection } from '@/components/Selection/selectionContext'
import { useEditor } from '@/components/editorContext'
import { useModificationsContext } from '@/components/ModificationsContext/ModificationsContext'
import { openEditorForItemsBounds } from '@/components/EditorContext/findBestWindowPosition'

export default function GroupView({
  id,
}: PropsWithChildren<{
  id: string
}>) {
  const selection = useSelection()
  const editor = useEditor()
  const { cellSize } = useGrid()
  const resizeContext = useResizeContext()
  const { fullyInsideSingleGroupId, isIntersectingAtLeastOneItem } =
    useModificationsContext()
  const itemsContext = useItemsContext()
  const { commitAllChanges } = useChanges()
  const item = useGroupItem(id)
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })

  const isSelected = selection.isSelected(id)

  const handleEdit = () => {
    if (selection.containsLink) return

    if (!selection.isSelected(item.id)) {
      selection.select(item)
    }

    const itemsBounds = Object.values(itemsContext.items)
      .filter((iItem) => selection.isSelected(iItem.id) || iItem.id === item.id)
      .map((iItem) => iItem.transform.global.bounds)
    openEditorForItemsBounds({ editor: editor.groupEditor, itemsBounds })
  }

  const handleRemove = () => {
    itemsContext.updateItems((items) => {
      Object.values(items).forEach((item) => {
        if (
          selection.isSelected(item.id) ||
          (item.type === 'link' &&
            item.groupId &&
            selection.isSelected(item.groupId))
        ) {
          delete items[item.id]
        }
      })
    })
    selection.deselectAll()
    commitAllChanges()
  }

  const { x, y } = item.transform.global.position

  return (
    <div
      id={id}
      className={clsx('absolute inline-block', item.shadow && 'shadow-md')}
      style={{
        zIndex: transform ? 100 : 0,
        left: x,
        top: y,
        borderRadius: item.borderRadius,
        background: item.background,
      }}
      ref={(el) => {
        if (el) {
          itemsContext.itemRefsMap.current.set(id, el)
        } else {
          itemsContext.itemRefsMap.current.delete(id)
        }
      }}
    >
      <Resizable
        enable={{
          top: false,
          right: true,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: true,
          bottomLeft: false,
          topLeft: false,
        }}
        size={item.transform}
        // grid={[cellSize.width, cellSize.height]}
        minWidth={Math.max(cellSize.width, item.maxItemRight)}
        minHeight={Math.max(cellSize.height, item.maxItemBottom)}
        onResizeStart={(event, direction, elementRef) => {
          resizeContext.onResizeStart({
            id,
            resizeCallbackParams: { event, direction, elementRef },
          })
          editor.openedEditor?.close()
        }}
        onResize={(event, direction, elementRef, delta) => {
          resizeContext.onResize({
            id,
            resizeCallbackParams: { event, direction, elementRef, delta },
          })
        }}
        onResizeStop={(event, direction, elementRef, delta) => {
          resizeContext.onResizeStop({
            id,
            resizeCallbackParams: { event, direction, elementRef, delta },
          })
        }}
        className={
          fullyInsideSingleGroupId === id
            ? 'bg-green-200'
            : isSelected &&
                !fullyInsideSingleGroupId &&
                isIntersectingAtLeastOneItem
              ? 'bg-red-300'
              : undefined
        }
        style={{
          borderWidth: item.borderWidth,
          borderColor: item.borderColor,
          borderRadius: item.borderRadius,
        }}
      >
        <ContextMenu
          onOpenChange={(open) => {
            if (open && !selection.isSelected(item.id)) {
              selection.select(item)
            }
          }}
        >
          <ContextMenuTrigger
            className="relative h-full block"
            style={{ margin: `-${item.borderWidth}px` }}
          >
            <button
              ref={setNodeRef}
              className={cn(
                'w-full h-full p-1 flex',
                getFlexAlignmentClasses(item.textAlignment),
              )}
              style={{
                color: item.color,
                fontWeight: item.bold ? 700 : 400,
                fontStyle: item.italic ? 'italic' : 'normal',
                fontSize: item.fontSize,
                textDecorationLine: item.underline ? 'underline' : 'none',
              }}
              {...attributes}
              {...listeners}
            >
              <div>{item.title}</div>
            </button>

            <div>
              {Object.values(itemsContext.items)
                .filter((item) => item.type === 'link' && item.groupId === id)
                .map((item) => (
                  <LinkView key={item.id} id={item.id} />
                ))}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              disabled={selection.containsLink}
              onClick={handleEdit}
            >
              Edit
            </ContextMenuItem>
            <ContextMenuItem onClick={handleRemove}>Remove</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Resizable>
    </div>
  )
}
