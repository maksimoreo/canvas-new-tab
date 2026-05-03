import { useDraggable } from '@dnd-kit/core'
import { useItemsContext, useLinkItem } from '@/components/itemsContext'
import { Resizable } from 're-resizable'
import { getFlexAlignmentClasses } from '@/lib/alignment'
import clsx from 'clsx'
import { useResizeContext } from '@/components/resizeContext'
import { useGrid } from '@/components/gridContext'
import { cn } from '@/lib/utils'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { useChanges } from '@/components/ChangesContext/ChangesContext'
import { useSelection } from '@/components/Selection/selectionContext'
import { useEditor } from '@/components/editorContext'
import { useModificationsContext } from '@/components/ModificationsContext/ModificationsContext'
import { openEditorForItemsBounds } from '@/components/EditorContext/findBestWindowPosition'

export default function LinkView({ id }: { id: string }) {
  const selection = useSelection()
  const editor = useEditor()
  const { cellSize } = useGrid()
  const resizeContext = useResizeContext()
  const { fullyInsideSingleGroupId, isIntersectingAtLeastOneItem } =
    useModificationsContext()
  const { commitAllChanges } = useChanges()

  const isSelected = selection.isSelected(id)

  const itemsContext = useItemsContext()
  const item = useLinkItem(id)
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })

  const handleEdit = () => {
    if (selection.containsGroup) return

    if (!selection.isSelected(item.id)) {
      selection.select(item)
    }

    const itemsBounds = Object.values(itemsContext.items)
      .filter((iItem) => selection.isSelected(iItem.id) || iItem.id === item.id)
      .map((iItem) => iItem.transform.global.bounds)
    openEditorForItemsBounds({ editor: editor.linkEditor, itemsBounds })
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

  const { x, y } = item.transform.local.position

  return (
    <div
      id={id}
      className={clsx('absolute inline-block', item.shadow && 'shadow-md')}
      style={{
        zIndex: transform ? 100 : 0,
        left: x,
        top: y,
        background: item.background,
        borderRadius: item.borderRadius,
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
        minWidth={cellSize.width}
        minHeight={cellSize.height}
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
          <ContextMenuTrigger>
            <button
              ref={setNodeRef}
              className={cn(
                'w-full h-full flex',
                getFlexAlignmentClasses(item.textAlignment),
                isSelected &&
                  !fullyInsideSingleGroupId &&
                  isIntersectingAtLeastOneItem
                  ? 'bg-red-300'
                  : null,
              )}
              style={{
                borderRadius: item.borderRadius,
                color: item.color,
                fontWeight: item.bold ? 700 : 400,
                fontStyle: item.italic ? 'italic' : 'normal',
                fontSize: item.fontSize,
                textDecorationLine: item.underline ? 'underline' : 'none',
              }}
              {...attributes}
              {...listeners}
            >
              <div className={'flex flex-col items-center'}>
                {item.showIcon ? (
                  <div
                    style={{ width: item.iconSize, fill: item.iconFill }}
                    dangerouslySetInnerHTML={{ __html: item.iconHtml }}
                  ></div>
                ) : null}

                <span>{item.title}</span>
              </div>
            </button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              disabled={selection.containsGroup}
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
