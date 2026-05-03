import { Label } from '@/components/ui/label'
import MultiNumberFieldWithSlider from './MultiNumberFieldWithSlider'
import { LinkItemTextField } from './MultiTextField'

export default function BorderPage() {
  return (
    <div className="px-2 py-4 flex flex-col gap-6">
      <div>
        <Label htmlFor="borderWidth">Width</Label>

        <MultiNumberFieldWithSlider
          field="borderWidth"
          defaultValue={0}
          className="mt-3"
        />
      </div>

      <div>
        <Label htmlFor="borderColor">Color</Label>

        <LinkItemTextField field="borderColor" className="mt-3" />
      </div>

      <div>
        <Label htmlFor="borderRadius">Radius</Label>

        <MultiNumberFieldWithSlider
          field="borderRadius"
          defaultValue={0}
          className="mt-3"
        />
      </div>
    </div>
  )
}
