import { Label } from '@/components/ui/label'
import { LinkItemTextField } from './MultiTextField'
import TextStyleField from './TextStyleField'
import AlignmentField from './AlignmentField'
import MultiNumberFieldWithSlider from './MultiNumberFieldWithSlider'

export default function TextPage() {
  return (
    <div className="px-2 py-4 flex flex-col gap-6">
      <div>
        <Label htmlFor="title">Title</Label>

        <LinkItemTextField field="title" className="mt-3" />
      </div>

      <div>
        <Label htmlFor="alignment">Alignment</Label>

        <AlignmentField />
      </div>

      <div>
        <Label htmlFor="color">Color</Label>

        <LinkItemTextField field="color" className="mt-3" />
      </div>

      <div>
        <Label htmlFor="color">Style</Label>

        <TextStyleField />
      </div>

      <div>
        <Label htmlFor="fontSize">Font size</Label>

        <MultiNumberFieldWithSlider
          field="fontSize"
          defaultValue={16}
          className="mt-3"
        />
      </div>
    </div>
  )
}
