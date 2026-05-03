import BorderPage from '../components/BorderPage'
import TextPage from '../components/TextPage'
import EditorLayout from '@/components/editor/editors/EditorLayout'
import AddressPage from './AddressPage'
import IconPage from './IconPage'
import BackgroundPage from './BackgroundPage'

export default function LinkEditor() {
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
          id: 'icon',
          title: 'Icon',
          component: <IconPage />,
        },
        {
          id: 'address',
          title: 'Address',
          component: <AddressPage />,
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
