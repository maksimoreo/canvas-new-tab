import TextPage from '../components/TextPage'
import BackgroundPage from '../components/BackgroundPage'
import BorderPage from '../components/BorderPage'
import EditorLayout from '@/components/editor/editors/EditorLayout'

export default function GroupEditor() {
  return (
    <EditorLayout
      defaultInitialView={'text'}
      items={[
        {
          id: 'text',
          title: 'Text',
          component: <TextPage />,
        },
        {
          id: 'background',
          title: 'Background',
          component: <BackgroundPage />,
        },
        {
          id: 'border',
          title: 'Border',
          component: <BorderPage />,
        },
      ]}
    />
  )
}
