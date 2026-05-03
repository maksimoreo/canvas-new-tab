import { useItemsContext } from '@/components/itemsContext'
import { useSelection } from '@/components/Selection/selectionContext'
import { ManagedInput } from '@/components/ui/managed-input'
import { cn } from '@/lib/utils'
import MultiValueField from './MultiValueField'

export default function MultiNumberEditor({
  className,
  field,
}: {
  className?: string
  field: 'fontSize'
}) {
  const itemsContext = useItemsContext()
  const { selectedItemsIds, selectedItems } = useSelection()

  return (
    <MultiValueField
      defaultValue={16}
      className={className}
      values={selectedItems.map((item) => item[field])}
      renderField={({ value, ref, state, setState }) => (
        <ManagedInput
          className={cn(className)}
          type="text"
          value={value}
          onValueChange={(value) => {
            if (state === 'begin') {
              setState('active')
            }

            const newValue = parseInt(value)

            itemsContext.updateItems((items) => {
              selectedItemsIds.forEach((id) => {
                items[id][field] = newValue
              })
            })
          }}
          onCommit={() => {}}
          onBlur={() => {
            setState('inactive')
          }}
          ref={ref}
        />
      )}
    />
  )
}
