import clsx from 'clsx'
import Canvas from './canvas/Canvas.tsx'
import ToolBox from '@/components/ToolBox.tsx'
import EditorContextProvider from '@/components/EditorContextProvider.tsx'
import EditorWindowsCanvas from '@/components/EditorWindowsCanvas.tsx'
import ChangesContextProvider from '@/components/ChangesContext/ChangesContextProvider.tsx'
import CanvasBackground from './CanvasBackground.tsx'
import GridView from '@/components/GridView.tsx'
import { useDocumentContext } from '@/components/documentContext.ts'
import SelectionBox from '@/components/SelectionBox/SelectionBox.tsx'
import SelectionContextProvider from '@/components/Selection/SelectionContextProvider.tsx'
import ModificationsContextProvider from '@/components/ModificationsContext/ModificationsContextProvider.tsx'
import RectangleSelect from '@/components/RectangleSelect/RectangleSelect.tsx'

export default function Editor() {
  const { fontFamily } = useDocumentContext()

  return (
    <ChangesContextProvider>
      <EditorContextProvider>
        <SelectionContextProvider>
          <div className={clsx('w-dvw h-dvh relative')}>
            <CanvasBackground />

            <div className="absolute left-1/2 top-1/2" style={{ fontFamily }}>
              <GridView />

              <ModificationsContextProvider>
                <Canvas />
              </ModificationsContextProvider>

              <SelectionBox />
            </div>

            <RectangleSelect />

            <EditorWindowsCanvas />

            <ToolBox />
          </div>
        </SelectionContextProvider>
      </EditorContextProvider>
    </ChangesContextProvider>
  )
}
