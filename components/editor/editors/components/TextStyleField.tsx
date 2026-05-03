import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
} from '@radix-ui/react-icons'
import MultiValueField from './MultiValueField'
import { useItemsContext } from '@/components/itemsContext'
import { useSelection } from '@/components/Selection/selectionContext'
import { useChanges } from '@/components/ChangesContext/ChangesContext'

export default function TextStyleField() {
  const itemsContext = useItemsContext()
  const selection = useSelection()
  const { commitAllChanges } = useChanges()

  const values = selection.selectedItems.map(
    (item) =>
      [
        item.bold && 'bold',
        item.italic && 'italic',
        item.underline && 'underline',
      ].filter((i) => !!i) as string[]
  )

  const nDifferentValues = new Set(values.map((value) => value.join())).size

  return (
    <div className="flex flex-row justify-center">
      <MultiValueField
        values={values}
        nDifferentValues={nDifferentValues}
        defaultValue={[]}
        focusOnEditClick={false}
        className="mt-3"
        renderField={({ value, state, setState }) => (
          <ToggleGroup
            className="mt-3"
            type="multiple"
            onValueChange={(value) => {
              if (state === 'begin') {
                setState('active')
              }

              const bold = !!value.includes('bold')
              const italic = !!value.includes('italic')
              const underline = !!value.includes('underline')

              itemsContext.updateItems((items) => {
                selection.selectedItemsIds.forEach((id) => {
                  const item = items[id]
                  item.bold = bold
                  item.italic = italic
                  item.underline = underline
                })
              })
              commitAllChanges()
            }}
            value={value}
          >
            <ToggleGroupItem value="bold">
              <FontBoldIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic">
              <FontItalicIcon />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline">
              <UnderlineIcon />
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      />
    </div>
  )
}
