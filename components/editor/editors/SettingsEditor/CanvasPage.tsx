import { useChanges } from '@/components/ChangesContext/ChangesContext'
import { useDocumentContext } from '@/components/documentContext'
import { useGrid } from '@/components/gridContext'
import { Checkbox } from '@/components/ui/checkbox'
import { ManagedInput } from '@/components/ui/managed-input'
import { Label } from '@/components/ui/label'
import FontPicker from 'react-fontpicker-ts-lite'

function transformCellSizeInput(cellSizeInput: string) {
  return Math.min(1024, Math.max(0, parseInt(cellSizeInput) || 32))
}

export default function CanvasPage() {
  const { commitAllChanges } = useChanges()
  const { fontFamily, setFontFamily } = useDocumentContext()
  const { cellSize, setCellSize, gridVisible, setGridVisible } = useGrid()

  return (
    <div className="px-2 py-4 flex flex-col gap-6">
      <div>
        <Label htmlFor="font">Font</Label>

        <div className="mt-3">
          <FontPicker
            defaultValue={fontFamily}
            autoLoad
            value={(value) => {
              // this function is called on first render for some reason
              if (value === fontFamily) return

              setFontFamily(value)
              commitAllChanges()
            }}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="cellSize">Grid cell size</Label>

        <div className="mt-3 flex flex-row items-center justify-center gap-3">
          <ManagedInput
            delayed
            type="number"
            className="max-w-20"
            id="cellWidth"
            placeholder="32"
            value={cellSize.width}
            onValueChange={(value) => {
              console.log('width')
              setCellSize({
                width: transformCellSizeInput(value),
                height: cellSize.height,
              })
              commitAllChanges()
            }}
          />

          <span>×</span>

          <ManagedInput
            delayed
            type="number"
            className="max-w-20"
            id="cellHeight"
            placeholder="32"
            value={cellSize.height}
            onValueChange={(value) => {
              console.log('height')
              setCellSize({
                width: cellSize.width,
                height: transformCellSizeInput(value),
              })
              commitAllChanges()
            }}
          />
        </div>

        <div className="mt-3 px-8 flex flex-row gap-3">
          <Checkbox
            id="showGrid"
            checked={gridVisible}
            onCheckedChange={(e) => {
              setGridVisible(!!e)
              commitAllChanges()
            }}
          />
          <Label htmlFor="showGrid">Show grid</Label>
        </div>
      </div>
    </div>
  )
}
