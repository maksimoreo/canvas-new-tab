import { Label } from '@/components/ui/label'
import { LinkItemTextField } from '../components/MultiTextField'

export default function AddressPage() {
  return (
    <div className="px-2 py-4">
      <Label htmlFor="url">URL</Label>

      <LinkItemTextField field="url" className="mt-3" />
    </div>
  )
}
