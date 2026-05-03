import { cn } from '@/lib/utils'
import React from 'react'

function ManagedInput({
  className,
  type,
  onCommit,
  onChange,
  onValueChange,
  value,
  delayed,
  onBlur,
  disableCommitWithEnter,
  ...props
}: React.ComponentProps<'input'> & {
  onCommit?: (newValue: string, originalValue: string) => void
  onValueChange?: (value: string) => void
  delayed?: boolean
  disableCommitWithEnter?: boolean
}) {
  const [originalValue, setOriginalValue] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(false)
  const [editingValue, setEditingValue] = React.useState<
    string | number | readonly string[] | undefined
  >('')

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.code !== 'Enter') return
      if (!isFocused) return

      if (onValueChange && editingValue) {
        onValueChange(editingValue.toString())
      }

      if (onCommit && editingValue) {
        onCommit(originalValue, editingValue.toString())
      }
    },
    [onValueChange, editingValue, originalValue, onCommit, isFocused]
  )

  React.useEffect(() => {
    if (!disableCommitWithEnter) {
      addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (!disableCommitWithEnter) {
        removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [disableCommitWithEnter, handleKeyDown])

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      onFocus={(e) => {
        setOriginalValue(e.target.value)
        setEditingValue(value)
        setIsFocused(true)
      }}
      onBlur={(e) => {
        if (onBlur) onBlur(e)

        const newValue = e.target.value

        if (newValue !== originalValue) {
          if (delayed) {
            if (typeof onChange === 'function') onChange(e)
            if (typeof onValueChange === 'function')
              onValueChange(e.target.value || originalValue || '')
          }

          if (typeof onCommit === 'function') {
            onCommit(newValue, originalValue)
          }
        }

        setIsFocused(false)
      }}
      onChange={(e) => {
        setEditingValue(e.target.value)

        if (delayed) return

        if (typeof onChange === 'function') onChange(e)
        if (typeof onValueChange === 'function')
          onValueChange(e.target.value || originalValue || '')
      }}
      value={isFocused ? editingValue : value}
      {...props}
    />
  )
}

export { ManagedInput }
