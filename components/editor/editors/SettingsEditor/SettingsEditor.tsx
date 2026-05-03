import EditorLayout from '@/components/editor/editors/EditorLayout'
import CanvasPage from './CanvasPage'
import BackgroundPage from './BackgroundPage'
import SystemPage from './SystemPage'
import DataPage from './DataPage'
import AboutPage from './AboutPage'

export default function SettingsEditor() {
  return (
    <EditorLayout
      defaultInitialView="canvas"
      items={[
        { id: 'canvas', title: 'Canvas', component: <CanvasPage /> },
        {
          id: 'background',
          title: 'Background',
          component: <BackgroundPage />,
        },
        { id: 'system', title: 'System', component: <SystemPage /> },
        { id: 'data', title: 'Data', component: <DataPage /> },
        { id: 'about', title: 'About', component: <AboutPage /> },
      ]}
    />
  )
}
