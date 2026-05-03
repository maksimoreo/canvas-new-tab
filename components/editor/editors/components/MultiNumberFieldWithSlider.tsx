import { useItemsContext } from '@/components/itemsContext'
import { useSelection } from '@/components/Selection/selectionContext'
import MultiValueField from './MultiValueField'
import { useChanges } from '@/components/ChangesContext/ChangesContext'
import { ManagedSliderWithInput } from '@/components/ui/slider-with-input'

export default function MultiNumberFieldWithSlider({
  field,
  defaultValue,
  className,
}: {
  field: 'borderWidth' | 'borderRadius' | 'fontSize' | 'iconSize'
  defaultValue: number
  className?: string
}) {
  const itemsContext = useItemsContext()
  const { selectedItemsIds, selectedItems } = useSelection()
  const { commitAllChanges } = useChanges()

  return (
    <MultiValueField
      defaultValue={defaultValue}
      className={className}
      values={selectedItems.map((item) => item[field])}
      renderField={({ value, ref, state, setState }) => {
        return (
          <ManagedSliderWithInput
            value={value}
            className={className}
            onValueChange={(value) => {
              if (state === 'begin') {
                setState('active')
              }

              itemsContext.updateItems((items) => {
                selectedItemsIds.forEach((id) => {
                  items[id][field] = value
                })
              })
            }}
            inputProps={{ ref }}
            onCommit={commitAllChanges}
          />
        )
      }}
    />
  )
}
