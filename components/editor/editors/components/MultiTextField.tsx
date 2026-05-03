import { useItemsContext } from '@/components/itemsContext'
import { useSelection } from '@/components/Selection/selectionContext'
import { ManagedInput } from '@/components/ui/managed-input'
import { cn } from '@/lib/utils'
import MultiValueField from './MultiValueField'
import { useChanges } from '@/components/ChangesContext/ChangesContext'
import type { CanvasItem, LinkItem } from '@/lib/canvas'

export default function MultiTextField({
  className,
  delayed,
  values,
  assignValue,
}: {
  className?: string
  delayed?: boolean
  values: string[]
  assignValue: (item: CanvasItem, value: string) => void
}) {
  const itemsContext = useItemsContext()
  const { selectedItemsIds } = useSelection()
  const { commitAllChanges } = useChanges()

  return (
    <MultiValueField
      defaultValue=""
      className={className}
      values={values}
      renderField={({ value, ref, state, setState }) => (
        <ManagedInput
          className={cn(className)}
          type="text"
          value={value}
          delayed={delayed}
          onValueChange={(value) => {
            if (state === 'begin') {
              setState('active')
            }

            itemsContext.updateItems((items) => {
              selectedItemsIds.forEach((id) => {
                assignValue(items[id], value)
              })
            })
          }}
          onCommit={() => {
            commitAllChanges()
          }}
          onBlur={() => {
            setState('inactive')
          }}
          ref={ref}
        />
      )}
    />
  )
}

export function LinkItemTextField({
  field,
  className,
  delayed,
}: {
  field:
    | 'color'
    | 'title'
    | 'background'
    | 'borderColor'
    | 'url'
    | 'iconHtml'
    | 'iconFill'
  className?: string
  delayed?: boolean
}) {
  const { selectedItems } = useSelection()

  return (
    <MultiTextField
      values={selectedItems.map((item) => (item as LinkItem)[field])}
      assignValue={(item, value) => {
        ;(item as LinkItem)[field] = value
      }}
      delayed={delayed}
      className={className}
    />
  )
}
