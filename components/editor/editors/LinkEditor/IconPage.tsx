import { Label } from '@/components/ui/label'
import MultiValueCheckbox from '../components/MultiValueCheckbox'
import { useSelection } from '@/components/Selection/selectionContext'
import { LinkItemTextField } from '../components/MultiTextField'
import MultiNumberFieldWithSlider from '../components/MultiNumberFieldWithSlider'

export default function IconPage() {
  const { selectedItems } = useSelection()

  const allShowHtml = selectedItems.every((item) => item.showIcon)

  return (
    <div className="px-2 py-4 flex flex-col gap-6">
      <div>
        <Label>Icon</Label>

        <MultiValueCheckbox
          className="mt-3"
          defaultValue={true}
          values={selectedItems.map((item) => item.showIcon)}
          assignValue={(item, value) => (item.showIcon = value)}
          inputId="showIcon"
          labelText="Show icon"
        />
      </div>

      {allShowHtml && (
        <>
          <div>
            <Label htmlFor="iconHtml">SVG</Label>

            <LinkItemTextField field="iconHtml" className="mt-3" delayed />
          </div>

          <div>
            <Label htmlFor="iconSize">Size</Label>

            <MultiNumberFieldWithSlider
              field="iconSize"
              defaultValue={16}
              className="mt-3"
            />
          </div>

          <div>
            <Label htmlFor="iconFill">Color</Label>

            <LinkItemTextField field="iconFill" className="mt-3" delayed />
          </div>
        </>
      )}
    </div>
  )
}
