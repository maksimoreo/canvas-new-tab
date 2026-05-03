import { SerializedDocument } from '@/components/editor/serialization/types'
import { Theme } from '@/components/Theme/context'

export const themeInStorage = storage.defineItem<Theme>('local:theme', {
  fallback: 'system',
})

export const documentInStorage =
  storage.defineItem<SerializedDocument>('local:document')
