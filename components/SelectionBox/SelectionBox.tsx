import { useSelection } from '../Selection/selectionContext'
import { SELECTION_BOX_OFFSET } from './selectionBoxHelpers'

export default function SelectionBox() {
  const { selectedItems, selectionBoxRefsMap } = useSelection()

  return selectedItems.map((item) => {
    const transform = item.transform

    return (
      <div
        key={item.id}
        className="border-blue-400 border"
        style={{
          position: 'absolute',
          left: transform.global.position.x - SELECTION_BOX_OFFSET,
          top: transform.global.position.y - SELECTION_BOX_OFFSET,
          width: transform.width + SELECTION_BOX_OFFSET * 2,
          height: transform.height + SELECTION_BOX_OFFSET * 2,
          borderRadius: 6,
          pointerEvents: 'none',
          zIndex: 200, // Over floating item (item that is being moved currently)
        }}
        ref={(element) => {
          if (element) {
            selectionBoxRefsMap.current.set(item.id, element)
          } else {
            selectionBoxRefsMap.current.delete(item.id)
          }
        }}
      ></div>
    )
  })
}
