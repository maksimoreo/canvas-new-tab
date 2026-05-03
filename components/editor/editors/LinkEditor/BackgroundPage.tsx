import { Label } from '@/components/ui/label'
import { LinkItemTextField } from '../components/MultiTextField'
import MultiValueCheckbox from '../components/MultiValueCheckbox'
import { useSelection } from '@/components/Selection/selectionContext'
import { LinkItem } from '@/lib/canvas'

export default function BackgroundPage() {
  const selection = useSelection()

  const selectedItems = selection.selectedItems as LinkItem[]

  return (
    <div className="px-2 py-4 flex flex-col gap-6">
      <div>
        <Label htmlFor="background">Background</Label>

        <LinkItemTextField field="background" className="mt-3" delayed />
      </div>

      <div>
        <Label>Shadow</Label>

        <MultiValueCheckbox
          className="mt-3"
          defaultValue={true}
          values={selectedItems.map((item) => item.shadow)}
          assignValue={(item, value) => (item.shadow = value)}
          inputId="shadow"
          labelText="Use shadow"
        />
      </div>

      <div>
        <Label>Grow on hover</Label>

        <MultiValueCheckbox
          className="mt-3"
          defaultValue={true}
          values={selectedItems.map((item) => item.growOnHover)}
          assignValue={(item, value) =>
            ((item as LinkItem).growOnHover = value)
          }
          inputId="growOnHover"
          labelText="Grow on hover"
        />
      </div>
    </div>
  )
}
