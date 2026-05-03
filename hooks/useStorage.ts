export function useStorageQuery<
  TValue,
  TMetadata extends Record<string, unknown> = {}
>(
  storageItem: WxtStorageItem<TValue, TMetadata>,
  options?: { onCompleted?: (value: TValue) => void }
) {
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState<TValue | null>(null)

  const reload = () => {
    setIsLoading(true)

    storageItem.getValue().then((value) => {
      setValue(value)
      setIsLoading(false)

      if (typeof options?.onCompleted === 'function') {
        options.onCompleted(value)
      }
    })
  }

  useEffect(() => {
    reload()
  }, [])

  return { value, isLoading, reload }
}

export function useStorageMutation<
  TValue,
  TMetadata extends Record<string, unknown> = {}
>(storageItem: WxtStorageItem<TValue, TMetadata>) {
  const [isLoading, setIsLoading] = useState(false)
  const currentPromise = useRef<Promise<void> | null>(null)
  const nextValue = useRef<{ value: TValue } | null>(null)

  const store = (value: TValue) => {
    // console.log('store')

    if (currentPromise.current) {
      nextValue.current = { value }
      return
    }

    setIsLoading(true)

    currentPromise.current = storageItem.setValue(value).then(() => {
      if (nextValue.current) {
        currentPromise.current = null
        store(nextValue.current.value)
        nextValue.current = null
      } else {
        currentPromise.current = null
        setIsLoading(false)

        // console.log('done')
      }
    })

    // Don't use this promise, because if `store` is called before first
    // promise returns, it will return promise that resolves after first
    // try and not the last one. This can be solve by constructing
    // internal promise (just not needed atm).

    // return currentPromise.current
  }

  return { store, isLoading }
}
