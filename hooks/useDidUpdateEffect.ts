import { useEffect, useRef } from 'react'

// Source: https://stackoverflow.com/a/53180013
export default function useDidUpdateEffect(fn: () => void, inputs: unknown[]) {
  const isMountingRef = useRef(false)

  useEffect(() => {
    isMountingRef.current = true
  }, [])

  useEffect(() => {
    if (!isMountingRef.current) {
      return fn()
    } else {
      isMountingRef.current = false
    }
  }, inputs)
}
