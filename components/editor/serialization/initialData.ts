import type { ItemsT } from '@/components/itemsContext'
import { deserialize } from './deserialization'
import type { SerializedDocument } from './types'
import {
  createCanvasItemTransform,
  type GroupItem,
  type LinkItem,
} from '@/lib/canvas'
import { serializeGroupItem, serializeLinkItem } from './serialization'
import { documentInStorage } from '@/lib/storage'

export async function loadInitialData(): Promise<InitialData> {
  const serializedDocument = await documentInStorage.getValue()

  // return defaultInitialData
  if (!serializedDocument) return defaultInitialData
  const deserialized = deserialize(serializedDocument)

  return { document: serializedDocument, deserialized }
}

export interface InitialData {
  document: SerializedDocument
  deserialized: { items: ItemsT; linkIndex: number; groupIndex: number }
}

// region default initial data

const cellSize = { width: 32, height: 32 }

const linkBase = {
  type: 'link',
  title: ' ',
  bold: false,
  italic: false,
  underline: false,
  color: 'black',
  fontSize: 20,
  borderColor: '#000000',
  borderWidth: 0,
  borderRadius: 6,
  textAlignment: 'center',
  groupId: null,
  showIcon: true,
  iconSize: 48,
  shadow: true,
  growOnHover: true,
} as const

const links: LinkItem[] = [
  {
    ...linkBase,
    id: 'link1',
    transform: createCanvasItemTransform({
      cellRectangle: { x: -10, y: -2, width: 4, height: 4 },
      cellSize,
    }),
    background: '#ffffff',
    url: 'https://www.gmail.com',
    iconHtml:
      '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Gmail</title><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>',
    iconFill: '#EA4335',
  },
  {
    ...linkBase,
    id: 'link2',
    transform: createCanvasItemTransform({
      cellRectangle: { x: -5, y: -2, width: 4, height: 4 },
      cellSize,
    }),
    background: '#ffffff',
    url: 'https://www.youtube.com',
    iconHtml:
      '<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>YouTube</title><path d=\"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z\"/></svg>',
    iconFill: '#ff0000',
  },
  {
    ...linkBase,
    id: 'link3',
    transform: createCanvasItemTransform({
      cellRectangle: { x: 0, y: -2, width: 4, height: 4 },
      cellSize,
    }),
    background: '#101411',
    url: 'https://www.github.com',
    iconHtml:
      '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    iconFill: '#ffffff',
  },
  {
    ...linkBase,
    id: 'link4',
    transform: createCanvasItemTransform({
      cellRectangle: { x: 5, y: -2, width: 4, height: 4 },
      cellSize,
    }),
    background: '#323437',
    url: 'https://www.monkeytype.com',
    iconHtml:
      '<svg role=\"img\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><title>Monkeytype</title><path d=\"M20 14.4a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6ZM8.8 14.4h4.8a.8.8 0 1 1 0 1.6H8.8a.8.8 0 1 1 0-1.6ZM7.2 9.6a.8.8 0 0 1 .8.8V12a.8.8 0 1 1-1.6 0v-1.6a.8.8 0 0 1 .8-.8Z M3.201 10.359A2.4 2.4 0 0 1 7.2 8.612a2.4 2.4 0 0 1 4 1.788V12a.8.8 0 1 1-1.6 0v-1.6a.8.8 0 1 0-1.6 0V12a.8.8 0 1 1-1.6 0v-1.6a.8.8 0 1 0-1.6 0V12a.8.8 0 1 1-1.6 0v-1.6l.001-.041ZM17.6 12.8v2.4a.8.8 0 1 1-1.6 0v-2.4h-2.306c-.493 0-.894-.358-.894-.8 0-.442.401-.8.894-.8h6.212c.493 0 .894.358.894.8 0 .442-.401.8-.894.8H17.6ZM16.8 8H20a.8.8 0 1 1 0 1.6h-3.2a.8.8 0 1 1 0-1.6ZM4 14.4h1.6a.8.8 0 1 1 0 1.6H4a.8.8 0 1 1 0-1.6ZM13.2 8h.4a.8.8 0 1 1 0 1.6h-.4a.8.8 0 1 1 0-1.6Z M1.6 14.4H0V8.8c0-2.208 1.792-4 4-4h16c2.208 0 4 1.792 4 4v6.4c0 2.208-1.792 4-4 4H4c-2.208 0-4-1.792-4-4v-1.6h1.6v1.6A2.4 2.4 0 0 0 4 17.6h16a2.4 2.4 0 0 0 2.4-2.4V8.8A2.4 2.4 0 0 0 20 6.4H4a2.4 2.4 0 0 0-2.4 2.4v5.6Z\"/></svg>',
    iconFill: '#E2B714',
  },
]

export const defaultInitialData: InitialData = {
  document: {
    background: 'white',
    gridCellSize: cellSize,
    gridVisible: true,
    linkIndex: 5,
    groupIndex: 1,
    items: [...links.map((link) => serializeLinkItem(link))],
    fontFamily: 'Roboto',
    showEditorModeButton: true,
  },
  deserialized: {
    items: {
      ...Object.fromEntries(links.map((link) => [link.id, link])),
    },
    linkIndex: 5,
    groupIndex: 1,
  },
}
