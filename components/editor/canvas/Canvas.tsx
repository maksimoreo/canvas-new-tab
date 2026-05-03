import { DndContext } from '@dnd-kit/core'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { useItemsContext } from '@/components/itemsContext'
import LinkView from './LinkView'
import GroupView from './GroupView'
import { ResizeContext } from '@/components/resizeContext'
import useSnapToGridModifier from '@/hooks/useSnapToGridModifier'
import { useMove } from './moveHelper'
import { useResize } from './resizeHelper'

export default function Canvas() {
  const itemsContext = useItemsContext()

  const moveHelper = useMove()
  const resizeHelper = useResize()

  useSnapToGridModifier({
    onEnableSnapToGrid: () => {
      if (moveHelper.isActiveRef.current) {
        moveHelper.onChangeEnableSnapToGrid(true)
      } else if (resizeHelper.isActiveRef.current) {
        resizeHelper.onChangeSnapToGrid(true)
      }
    },
    onDisableSnapToGrid: () => {
      if (moveHelper.isActiveRef.current) {
        moveHelper.onChangeEnableSnapToGrid(false)
      } else if (resizeHelper.isActiveRef.current) {
        resizeHelper.onChangeSnapToGrid(false)
      }
    },
  })

  // region render

  return (
    <DndContext
      modifiers={[restrictToWindowEdges]}
      onDragStart={moveHelper.onStart}
      onDragMove={moveHelper.onMove}
      onDragEnd={moveHelper.onStop}
      autoScroll={false}
    >
      <ResizeContext.Provider
        value={{
          onResizeStart: resizeHelper.onStart,
          onResize: resizeHelper.onMove,
          onResizeStop: resizeHelper.onStop,
        }}
      >
        {Object.values(itemsContext.items)
          .filter((item) => item.type === 'group')
          .map((item) => (
            <GroupView key={item.id} id={item.id} />
          ))}

        {Object.values(itemsContext.items)
          .filter((item) => item.type === 'link' && !item.groupId)
          .map((item) => (
            <LinkView key={item.id} id={item.id} />
          ))}
      </ResizeContext.Provider>
    </DndContext>
  )
}
