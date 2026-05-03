import { useItemsContext } from '@/components/itemsContext'
import type { GroupItem, LinkItem } from '@/lib/canvas'
import LinkView from './LinkView'
import { useDocumentContext } from '@/components/documentContext'
import GroupView from './GroupView'
import SwitchToEditorMode from '@/components/SwitchToEditorMode'

export default function Present() {
  const { items } = useItemsContext()
  const { background, fontFamily } = useDocumentContext()

  return (
    <div className="w-dvw h-dvh" style={{ background, fontFamily }}>
      <div className="absolute left-1/2 top-1/2">
        {Object.values(items)
          .filter((item) => item.type === 'group')
          .map((item) => (
            <GroupView key={item.id} item={item as GroupItem} />
          ))}

        {Object.values(items)
          .filter((item) => item.type === 'link')
          .map((item) => (
            <LinkView key={item.id} item={item as LinkItem} />
          ))}
      </div>

      <SwitchToEditorMode />
    </div>
  )
}
