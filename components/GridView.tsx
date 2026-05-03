import { useGrid } from './gridContext'

export default function GridView() {
  const {
    cellSize: { width, height },
    gridVisible,
  } = useGrid()

  if (!gridVisible) return

  const sharedStyle = {
    width: '50vw',
    height: '50vh',
    backgroundSize: `${width}px ${height}px`,
    backgroundImage: `linear-gradient(to right, #f3f4f6 1px, transparent 1px), linear-gradient(to bottom, #f3f4f6 1px, transparent 1px)`,
  }

  // 4 elements positioned carefully to maintain middle point of the grid

  return (
    <>
      <div
        className="grid absolute pointer-events-none"
        style={{
          ...sharedStyle,
        }}
      ></div>
      <div
        className="grid absolute pointer-events-none"
        style={{
          top: 'calc(-50vh + 1px)',
          transform: 'scaleY(-1)',
          ...sharedStyle,
        }}
      ></div>
      <div
        className="grid absolute pointer-events-none"
        style={{
          left: 'calc(-50vw + 1px)',
          transform: 'scaleX(-1)',
          ...sharedStyle,
        }}
      ></div>
      <div
        className="grid absolute pointer-events-none"
        style={{
          top: 'calc(-50vh + 1px)',
          left: 'calc(-50vw + 1px)',
          transform: 'scale(-1, -1)',
          ...sharedStyle,
        }}
      ></div>
    </>
  )
}
