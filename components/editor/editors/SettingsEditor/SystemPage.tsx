import { useChanges } from '@/components/ChangesContext/ChangesContext'
import { useDocumentContext } from '@/components/documentContext'
import ThemeSwitch from '@/components/Theme/ThemeSwitch'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Kbd } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import { InfoIcon } from 'lucide-react'

export default function SystemPage() {
  const { showEditorModeButton, setShowEditorModeButton } = useDocumentContext()
  const { commitAllChanges } = useChanges()

  return (
    <div className="px-2 py-4 flex flex-col gap-6">
      <div>
        <Label>Theme</Label>

        <div className="mt-3 flex justify-center">
          <ThemeSwitch />
        </div>
      </div>

      <div>
        <Label>Editor Mode button</Label>

        <div className="mt-3 px-8 flex flex-row gap-3">
          <Checkbox
            id="showEditorModeButton"
            checked={showEditorModeButton}
            onCheckedChange={(e) => {
              setShowEditorModeButton(!!e)
              commitAllChanges()
            }}
          />

          <Label htmlFor="showEditorModeButton">Show Editor Mode button</Label>
        </div>

        <Alert className="mt-6">
          <InfoIcon />
          <AlertTitle>Hidden Editor Mode button</AlertTitle>
          <AlertDescription>
            When Editor Mode button is hidden, you still can access Editor Mode:
            <ul>
              <li>
                {' '}
                - press <Kbd>~</Kbd> key when search bar is not focused
              </li>
              <li>
                {' '}
                - use <code className="typography-code">
                  toggleAppMode()
                </code>{' '}
                in DevTools console
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
