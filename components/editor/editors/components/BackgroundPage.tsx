import { Label } from '@/components/ui/label'
import { LinkItemTextField } from './MultiTextField'
import MultiValueCheckbox from './MultiValueCheckbox'
import { useSelection } from '@/components/Selection/selectionContext'

export default function BackgroundPage() {
  const { selectedItems } = useSelection()

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
    </div>
  )
}
