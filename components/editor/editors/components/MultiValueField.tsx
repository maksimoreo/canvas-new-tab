import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState, type JSX, type Ref } from 'react'

export type MultiValueFieldStateT = 'inactive' | 'begin' | 'active'

export default function MultiValueField<ValueT>({
  className,
  defaultValue,
  renderField,
  values,
  focusOnEditClick = true,
  nDifferentValues,
}: {
  renderField: (props: {
    value: ValueT
    ref: Ref<HTMLInputElement>
    state: MultiValueFieldStateT
    setState: (state: MultiValueFieldStateT) => void
  }) => JSX.Element
  values: ValueT[]
  defaultValue: ValueT
  className?: string
  focusOnEditClick?: boolean
  nDifferentValues?: number
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<MultiValueFieldStateT>('inactive')

  useEffect(() => {
    // Element can only be focused if it is visible
    // so after display: none is removed
    if (focusOnEditClick && state === 'begin') {
      inputRef.current!.focus()
    }
  }, [focusOnEditClick, state])

  const nnDifferentValues =
    nDifferentValues === undefined ? new Set(values).size : nDifferentValues

  if (state === 'inactive' && nnDifferentValues !== 1) {
    return (
      <Button
        className={cn('italic font-normal w-full', className)}
        onClick={() => {
          setState('begin')
        }}
      >
        change {nnDifferentValues} different values
      </Button>
    )
  }

  return renderField({
    value: state === 'begin' ? defaultValue : values[0],
    ref: inputRef,
    state,
    setState,
  })
}
