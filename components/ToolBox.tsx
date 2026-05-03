import { EyeOpenIcon, GearIcon } from '@radix-ui/react-icons'
import { useEditor } from './editorContext'
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group'
import { useAppMode } from './App/AppContext'
import { Kbd } from './ui/kbd'
import { useSelection } from './Selection/selectionContext'

export default function ToolBox() {
  const editor = useEditor()
  const selection = useSelection()
  const { setAppMode } = useAppMode()

  const value: string[] = []

  if (editor.settingsEditor.isOpened) value.push('settings')

  const handleToggleSettings = () => {
    selection.deselectAll()
    editor.settingsEditor.toggle()
  }

  return (
    <div className="absolute bottom-4 right-4">
      <div className="flex flex-row rounded-md bg-background shadow-md items-center">
        <p className="mx-6 italic">Editor Mode</p>

        <ToggleGroup value={value} type="multiple" variant="outline">
          <ToggleGroupItem
            value="settings"
            className="px-4"
            onClick={handleToggleSettings}
          >
            <GearIcon /> <span>Settings</span>
          </ToggleGroupItem>

          <ToggleGroupItem
            value="finish"
            className="px-4"
            onClick={() => setAppMode('present')}
          >
            <EyeOpenIcon />{' '}
            <span>
              Finish <Kbd>~</Kbd>
            </span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}
