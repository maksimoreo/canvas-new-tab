import { useEffect } from 'react'

export default function useKeybind({
  code,
  ctrlKey,
  shiftKey,
  onDown,
}: {
  code: string
  ctrlKey?: boolean
  shiftKey?: boolean
  onDown: () => void
}) {
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.repeat) return
    if (event.code !== code) return
    if (ctrlKey && !event.ctrlKey) return
    if (shiftKey && !event.shiftKey) return

    const targetName = (event.target as Element).nodeName.toLowerCase()
    if (targetName === 'input' || targetName === 'textarea') return

    onDown()
  }

  useEffect(() => {
    addEventListener('keydown', handleKeydown)

    return () => {
      removeEventListener('keydown', handleKeydown)
    }
  })
}
