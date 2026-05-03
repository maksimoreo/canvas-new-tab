import { useModificationsContext } from '@/components/ModificationsContext/ModificationsContext'
import { useEffect } from 'react'

interface Options {
  onEnableSnapToGrid?: () => void
  onDisableSnapToGrid?: () => void
}

export default function useSnapToGridModifier(options?: Options) {
  const modificationsContext = useModificationsContext()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Shift') return

      modificationsContext.setEnableSnapToGrid(true)

      if (typeof options?.onEnableSnapToGrid === 'function') {
        options.onEnableSnapToGrid()
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key !== 'Shift') return

      modificationsContext.setEnableSnapToGrid(false)

      if (typeof options?.onDisableSnapToGrid === 'function') {
        options.onDisableSnapToGrid()
      }
    }

    addEventListener('keydown', handleKeyDown)
    addEventListener('keyup', handleKeyUp)

    return () => {
      removeEventListener('keydown', handleKeyDown)
      removeEventListener('keyup', handleKeyUp)
    }
  }, [options, modificationsContext])
}
