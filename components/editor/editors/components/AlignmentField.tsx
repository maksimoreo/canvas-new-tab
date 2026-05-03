import { useChanges } from '@/components/ChangesContext/ChangesContext'
import { useItemsContext } from '@/components/itemsContext'
import { useSelection } from '@/components/Selection/selectionContext'
import MultiValueField from './MultiValueField'
import type { AlignmentT } from '@/lib/alignment'
import { SelectAlignment } from '@/components/ui/select-alignment'

export default function AlignmentField() {
  const itemsContext = useItemsContext()
  const selection = useSelection()
  const { commitAllChanges } = useChanges()

  const values = selection.selectedItems.map((item) => item.textAlignment)

  return (
    <MultiValueField
      defaultValue="center"
      className="mt-3"
      values={values}
      focusOnEditClick={false}
      renderField={({ value }) => (
        <div className="flex flex-row justify-center mt-3">
          <SelectAlignment
            value={value as AlignmentT}
            onChange={(alignment) => {
              itemsContext.updateItems((items) => {
                selection.selectedItemsIds.forEach((id) => {
                  const item = items[id]
                  item.textAlignment = alignment
                })
              })

              commitAllChanges()
            }}
          />
        </div>
      )}
    />
  )
}
