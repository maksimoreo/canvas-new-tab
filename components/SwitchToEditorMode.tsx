import { Pencil2Icon } from '@radix-ui/react-icons'
import { Button } from './ui/button'
import { useAppMode } from './App/AppContext'
import { useDocumentContext } from './documentContext'

export default function SwitchToEditorMode() {
  const { setAppMode } = useAppMode()
  const { showEditorModeButton } = useDocumentContext()

  if (!showEditorModeButton) return

  return (
    <div className="absolute bottom-4 right-4">
      <Button onClick={() => setAppMode('editor')}>
        <Pencil2Icon />
      </Button>
    </div>
  )
}
