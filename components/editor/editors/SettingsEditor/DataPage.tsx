import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSerializer } from '@/components/editor/serialization/useSerializer'
import { download } from '@/lib/utils'
import { useRef, useState } from 'react'
import { useChanges } from '@/components/ChangesContext/ChangesContext'

export default function DataPage() {
  const [loading, setLoading] = useState(false)
  const [isFileSelected, setIsFileSelected] = useState(false)

  const { save, load } = useSerializer()
  const { commitAllChanges } = useChanges()

  const inputRef = useRef<HTMLInputElement>(null)

  const handleImportData = () => {
    if (!inputRef.current) return
    if (!inputRef.current.files) return

    const file = inputRef.current.files[0]

    if (!file) return

    const fileReader = new FileReader()
    fileReader.readAsText(file)
    setLoading(true)

    fileReader.onload = (e) => {
      const json = e.target!.result
      const state = JSON.parse(json as string)
      load(state)
      commitAllChanges()
      setLoading(false)
    }
  }

  const handleExportData = () => {
    const text = JSON.stringify(save(), undefined, 2)
    download(text, 'export.json', 'text/plain')
  }

  return (
    <div className="px-2 py-4 flex flex-col gap-6">
      <div>
        <Label htmlFor="file">Import</Label>

        <div className="flex gap-3 mt-3">
          <Input
            ref={inputRef}
            disabled={loading}
            id="file"
            type="file"
            onChange={(e) => {
              setIsFileSelected(!!e.target.files?.length)
            }}
          />

          <Button
            disabled={loading || !isFileSelected}
            className=""
            onClick={handleImportData}
          >
            Import data
          </Button>
        </div>
      </div>

      <div>
        <Label>Export</Label>

        <Button
          disabled={loading}
          className="w-full mt-3"
          onClick={handleExportData}
        >
          Export data
        </Button>
      </div>
    </div>
  )
}
