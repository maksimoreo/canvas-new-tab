export default function RectangleSelect() {
  return (
    <div className="w-dvw h-dvh relative" style={{ pointerEvents: 'none' }}>
      <div
        id="rectangle-select"
        className="border-blue-400 border-1 absolute"
        style={{
          display: 'none',
        }}
      ></div>
    </div>
  )
}
