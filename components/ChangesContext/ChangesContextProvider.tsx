import { useState, type PropsWithChildren } from 'react'
import { ChangesContext } from './ChangesContext'
import { useSerializer } from '@/components/editor/serialization/useSerializer'
import useDidUpdateEffect from '@/hooks/useDidUpdateEffect'
import { documentInStorage } from '@/lib/storage'

export default function ChangesContextProvider({
  children,
}: PropsWithChildren) {
  const [trigger, setTrigger] = useState(false)

  const { save } = useSerializer()
  const { store } = useStorageMutation(documentInStorage)

  useDidUpdateEffect(() => {
    const state = save()
    store(state)
  }, [trigger])

  return (
    <ChangesContext.Provider
      value={{
        commitAllChanges: () => {
          // commitAllChanges is usually called immediately after updating dependend state.
          // action must be delayed to next render, because save() cannot access most up-to-date state
          setTrigger(!trigger)
        },
      }}
    >
      {children}
    </ChangesContext.Provider>
  )
}
