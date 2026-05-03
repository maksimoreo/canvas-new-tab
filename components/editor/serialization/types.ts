// for position using regular (not cell), global (not local) position
// for size using regular (not cell) size

import type { AlignmentT } from '@/lib/alignment'
import type { Coordinates, WidthHeight } from '@/lib/canvas'

export interface SerializedCanvasItemShared {
  id: string
  position: Coordinates
  size: WidthHeight
  title: string
  color: string
  bold: boolean
  italic: boolean
  underline: boolean
  fontSize: number
  textAlignment: AlignmentT

  background: string

  borderWidth: number
  borderColor: string
  borderRadius: number

  shadow: boolean

  showIcon: boolean
  iconHtml: string
  iconSize: number
  iconFill: string
}

export type SerializedLinkItem = {
  type: 'link'

  url: string
  groupId: string | null
  growOnHover: boolean
} & SerializedCanvasItemShared

export type SerializedGroupItem = {
  type: 'group'
} & SerializedCanvasItemShared

export type SerializedCanvasItem = SerializedLinkItem | SerializedGroupItem

export interface SerializedDocument {
  background: string
  gridCellSize: WidthHeight
  gridVisible: boolean
  linkIndex: number
  groupIndex: number
  fontFamily: string
  showEditorModeButton: boolean
  items: SerializedCanvasItem[]
}
