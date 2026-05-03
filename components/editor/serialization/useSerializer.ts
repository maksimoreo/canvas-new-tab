import { useDocumentContext } from '@/components/documentContext'
import { useGrid } from '@/components/gridContext'
import { useItemsContext } from '@/components/itemsContext'
import type { SerializedDocument } from './types'
import { groupIdGenerator, linkIdGenerator } from '@/lib/share'
import { serializeGroupItem, serializeLinkItem } from './serialization'
import { deserialize } from './deserialization'

export function useSerializer() {
  const documentContext = useDocumentContext()
  const itemsContext = useItemsContext()
  const gridContext = useGrid()

  const save = (): SerializedDocument => {
    return {
      background: documentContext.background,
      gridCellSize: gridContext.cellSize,
      gridVisible: gridContext.gridVisible,
      linkIndex: linkIdGenerator.current,
      groupIndex: groupIdGenerator.current,
      fontFamily: documentContext.fontFamily,
      showEditorModeButton: documentContext.showEditorModeButton,
      items: Object.values(itemsContext.items)
        .map((item) =>
          item.type === 'group'
            ? serializeGroupItem(item)
            : item.type === 'link'
              ? serializeLinkItem(item)
              : undefined,
        )
        .filter((i) => !!i),
    }
  }

  const load = (document: SerializedDocument) => {
    const deserialized = deserialize(document)

    linkIdGenerator.current = deserialized.linkIndex
    groupIdGenerator.current = deserialized.groupIndex

    documentContext.setShowEditorModeButton(document.showEditorModeButton)
    documentContext.setBackground(document.background)
    documentContext.setFontFamily(document.fontFamily)
    gridContext.setCellSize(document.gridCellSize)
    itemsContext.setItems(deserialized.items)
  }

  return { save, load }
}
