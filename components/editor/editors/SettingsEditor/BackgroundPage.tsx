import { useChanges } from '@/components/ChangesContext/ChangesContext'
import { useDocumentContext } from '@/components/documentContext'
import { ManagedInput } from '@/components/ui/managed-input'
import { Label } from '@/components/ui/label'

export default function BackgroundPage() {
  const { commitAllChanges } = useChanges()
  const { background, setBackground } = useDocumentContext()

  return (
    <div className="px-2 py-4">
      <Label htmlFor="background">Color</Label>

      <ManagedInput
        id="background"
        className="mt-3"
        delayed
        value={background}
        onValueChange={(value) => {
          console.log('onChange')
          setBackground(value)
          commitAllChanges()
        }}
      />
    </div>
  )
}
