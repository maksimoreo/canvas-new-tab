import {
  subtract,
  type CanvasItem,
  type CanvasItemTransform,
  type Coordinates,
  type GroupItem,
  type LinkItem,
  type RectangleTransform,
  type WidthHeight,
} from '@/lib/canvas'
import type {
  SerializedCanvasItem,
  SerializedDocument,
  SerializedGroupItem,
  SerializedLinkItem,
} from './types'

function createRectangleTransform(
  position: Coordinates,
  size: WidthHeight
): RectangleTransform {
  return {
    position,
    bounds: {
      left: position.x,
      right: position.x + size.width,
      top: position.y,
      bottom: position.y + size.height,
    },
  }
}

function createCanvasItemTransform(
  position: Coordinates,
  size: WidthHeight,
  parentPosition: Coordinates | null
): CanvasItemTransform {
  const global = createRectangleTransform(position, size)

  return {
    global,
    local: parentPosition
      ? createRectangleTransform(subtract(position, parentPosition), size)
      : global,
    width: size.width,
    height: size.height,
  }
}

function deserializeSharedCanvasItemProps(item: SerializedCanvasItem) {
  return {
    id: item.id,
    title: item.title,
    color: item.color || 'black',
    bold: item.bold || false,
    italic: item.italic || false,
    underline: item.underline || false,
    fontSize: item.fontSize,

    background: item.background,
    shadow: item.shadow,

    borderWidth: item.borderWidth,
    borderColor: item.borderColor,
    borderRadius: item.borderRadius,

    showIcon: item.showIcon,
    iconHtml: item.iconHtml,
    iconSize: item.iconSize,
    iconFill: item.iconFill,

    movingTransform: null,
  }
}

export function deserializeLinkItem(
  item: SerializedLinkItem,
  group: SerializedGroupItem | null
): LinkItem {
  return {
    ...deserializeSharedCanvasItemProps(item),
    id: item.id,
    type: 'link',
    transform: createCanvasItemTransform(
      item.position,
      item.size,
      group ? group.position : null
    ),
    groupId: item.groupId,
    url: item.url,
    textAlignment: item.textAlignment,
    growOnHover: item.growOnHover,
  }
}

export function deserializeGroupItem(item: SerializedGroupItem): GroupItem {
  return {
    ...deserializeSharedCanvasItemProps(item),
    id: item.id,
    type: 'group',
    transform: createCanvasItemTransform(item.position, item.size, null),
    textAlignment: item.textAlignment,
    maxItemRight: 0, // todo ;; lazy
    maxItemBottom: 0, // todo ;; lazy
  }
}

export function deserialize(document: SerializedDocument) {
  const groupItemsIndex = Object.fromEntries(
    document.items
      .filter((item) => item.type === 'group')
      .map((item) => [item.id, item])
  )

  const items = Object.fromEntries(
    document.items.map((item) => [
      item.id,
      item.type === 'link'
        ? deserializeLinkItem(
            item,
            item.groupId ? groupItemsIndex[item.groupId] : null
          )
        : deserializeGroupItem(item),
    ])
  )

  const linkIndex = findLastId(
    linkIdRegex,
    Object.values(items).filter((item) => item.type === 'link')
  )
  const groupIndex = findLastId(
    groupIdRegex,
    Object.values(items).filter((item) => item.type === 'group')
  )

  return { items, linkIndex, groupIndex }
}

const linkIdRegex = /^link(\d+)$/
const groupIdRegex = /^group(\d+)$/

function findLastId(regex: RegExp, items: CanvasItem[]) {
  const ids = items
    .map((item) => {
      const result = regex.exec(item.id)
      if (!result) return null
      return parseInt(result[1])
    })
    .filter((i) => !!i) as number[]

  if (ids.length === 0) return 1

  return Math.max(...ids) + 1
}
