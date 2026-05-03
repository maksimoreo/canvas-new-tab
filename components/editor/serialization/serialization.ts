import type { CanvasItem, GroupItem, LinkItem } from '@/lib/canvas'
import type { SerializedGroupItem, SerializedLinkItem } from './types'

function serializeSharedCanvasItemProps(item: CanvasItem) {
  return {
    id: item.id,
    position: item.transform.global.position,
    size: {
      width: item.transform.width,
      height: item.transform.height,
    },
    title: item.title,
    color: item.color,
    bold: item.bold,
    italic: item.italic,
    underline: item.underline,
    fontSize: item.fontSize,
    background: item.background,
    borderWidth: item.borderWidth || 0,
    borderColor: item.borderColor,
    borderRadius: item.borderRadius || 0,
    textAlignment: item.textAlignment,
    shadow: item.shadow,
    showIcon: item.showIcon,
    iconHtml: item.iconHtml,
    iconSize: item.iconSize,
    iconFill: item.iconFill,
  }
}

export function serializeLinkItem(item: LinkItem): SerializedLinkItem {
  return {
    ...serializeSharedCanvasItemProps(item),
    type: 'link' as const,
    url: item.url,
    groupId: item.groupId,
    growOnHover: item.growOnHover,
  }
}

export function serializeGroupItem(item: GroupItem): SerializedGroupItem {
  return {
    ...serializeSharedCanvasItemProps(item),
    type: 'group' as const,
  }
}
