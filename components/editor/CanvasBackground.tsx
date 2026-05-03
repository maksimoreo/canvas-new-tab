import { useState } from 'react'
import { useEditor } from '@/components/editorContext'
import { useGrid } from '@/components/gridContext'
import { useItemsContext } from '@/components/itemsContext'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { groupIdGenerator, linkIdGenerator } from '@/lib/share'
import {
  createCanvasItemTransform,
  type Coordinates,
  type GroupItem,
  type LinkItem,
} from '@/lib/canvas'
import DocumentBackground from './DocumentBackground'
import { useSelection } from '@/components/Selection/selectionContext'
import { useChanges } from '@/components/ChangesContext/ChangesContext'
import useRectangleSelect from '@/components/RectangleSelect/useRectangleSelect'
import { findBestWindowPosition } from '@/components/EditorContext/findBestWindowPosition'

export default function CanvasBackground() {
  const [clickCellPosition, setClickCellPosition] = useState<Coordinates>({
    x: 0,
    y: 0,
  })
  const { cellRoundX, cellRoundY, cellSize } = useGrid()
  const itemsContext = useItemsContext()
  const selection = useSelection()
  const { linkEditor, groupEditor, settingsEditor } = useEditor()
  const { commitAllChanges } = useChanges()

  const rectangleSelect = useRectangleSelect()

  const handleAddLink = () => {
    // TODO: Check collision

    const index = linkIdGenerator.next().toString()
    const id = `link${index}`

    const item: LinkItem = {
      id,
      type: 'link',
      transform: createCanvasItemTransform({
        cellRectangle: {
          x: clickCellPosition.x - 1,
          y: clickCellPosition.y - 1,
          width: 6,
          height: 6,
        },
        cellSize,
      }),
      borderWidth: 0,
      borderColor: '#ffffff',
      borderRadius: 6,
      title: `Link ${index}`,
      bold: false,
      italic: false,
      underline: false,
      color: 'black',
      fontSize: 20,
      groupId: null,
      textAlignment: 'center',
      background: '#ffffff',
      url: '#',
      showIcon: false,
      iconHtml: '',
      iconSize: 16,
      iconFill: 'white',
      shadow: true,
      growOnHover: true,
    } as const

    itemsContext.addItem(item)
    selection.select(item)

    const editorPosition = findBestWindowPosition({
      itemsBounds: [item.transform.global.bounds],
      windowSize: linkEditor.size,
    })
    linkEditor.setPosition(editorPosition)
    linkEditor.open()

    commitAllChanges()
  }

  const handleAddGroup = () => {
    const index = groupIdGenerator.next().toString()
    const id = `group${index}`

    const item: GroupItem = {
      id,
      type: 'group',
      transform: createCanvasItemTransform({
        cellRectangle: {
          x: clickCellPosition.x - 3,
          y: clickCellPosition.y - 2,
          width: 6,
          height: 4,
        },
        cellSize,
      }),
      borderWidth: 0,
      borderColor: '#ffffff',
      borderRadius: 6,
      title: `Group ${index}`,
      bold: false,
      italic: false,
      underline: false,
      color: 'black',
      fontSize: 20,
      textAlignment: 'topLeft',
      maxItemBottom: 0,
      maxItemRight: 0,
      background: '#ffffff',
      showIcon: false,
      iconHtml: '',
      iconSize: 16,
      iconFill: 'white',
      shadow: true,
    } as const

    itemsContext.addItem(item)
    selection.select(item)

    const editorPosition = findBestWindowPosition({
      itemsBounds: [item.transform.global.bounds],
      windowSize: groupEditor.size,
    })
    groupEditor.setPosition(editorPosition)
    groupEditor.open()

    commitAllChanges()
  }

  const handleSettings = () => {
    settingsEditor.open()
  }

  const handleChangeBackground = () => {
    settingsEditor.setEditorData({
      ...settingsEditor.editorData,
      view: 'background',
    })
    settingsEditor.open()
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          id="canvas-background"
          onMouseDown={(e) => {
            setClickCellPosition({
              x: cellRoundX(e.pageX - window.innerWidth / 2),
              y: cellRoundY(e.pageY - window.innerHeight / 2),
            })

            rectangleSelect.handleMouseDown(e)
          }}
        >
          <DocumentBackground />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleAddLink}>Add Link</ContextMenuItem>
        <ContextMenuItem onClick={handleAddGroup}>Add Group</ContextMenuItem>
        <ContextMenuItem onClick={handleSettings}>Settings</ContextMenuItem>
        <ContextMenuItem onClick={handleChangeBackground}>
          Change background
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
