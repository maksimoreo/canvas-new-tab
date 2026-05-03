import { Checkbox } from '@/components/ui/checkbox'
import MultiValueField from './MultiValueField'
import { useItemsContext } from '@/components/itemsContext'
import { useSelection } from '@/components/Selection/selectionContext'
import type { CanvasItem } from '@/lib/canvas'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useChanges } from '@/components/ChangesContext/ChangesContext'

export default function MultiValueCheckbox({
  defaultValue,
  className,
  values,
  assignValue,
  inputId,
  labelText,
}: {
  defaultValue: boolean
  className?: string
  values: boolean[]
  assignValue: (item: CanvasItem, value: boolean) => void
  inputId: string
  labelText: string
}) {
  const itemsContext = useItemsContext()
  const { selectedItemsIds } = useSelection()
  const { commitAllChanges } = useChanges()

  return (
    <MultiValueField
      className={className}
      defaultValue={defaultValue}
      values={values}
      focusOnEditClick={false}
      renderField={({ value, state, setState }) => (
        <div className={cn('flex gap-3 px-8', className)}>
          <Checkbox
            id={inputId}
            checked={value}
            onCheckedChange={(checked) => {
              if (state === 'begin') {
                setState('active')
              }

              itemsContext.updateItems((items) => {
                selectedItemsIds.forEach((id) => {
                  assignValue(items[id], !!checked)
                })
              })

              commitAllChanges()
            }}
          />

          <Label htmlFor={inputId}>{labelText}</Label>
        </div>
      )}
    />
  )
}
