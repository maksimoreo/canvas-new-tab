import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'
import { Slider } from './slider'
import { Input } from './input'

function SliderWithInput({
  className,
  value,
  onChange,
  min = 0,
  max = 100,
  ...props
}: Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  'value' | 'onChange'
> & {
  value: number | undefined
  onChange: (value: number | undefined) => void
}) {
  return (
    <div className={cn('flex flex-row gap-4', className)}>
      <Slider
        value={[value || 0]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        className="grow"
        {...props}
      />

      <Input
        value={value || ''}
        onChange={(e) => onChange(parseInt(e.target.value) || undefined)}
        min={min}
        max={max}
        className="max-w-20"
        type="number"
      />
    </div>
  )
}

function ManagedSliderWithInput({
  className,
  value,
  onValueChange,
  min = 0,
  max = 100,
  onCommit,
  inputProps,
  sliderProps,
}: {
  className?: string | undefined
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  onCommit?: (
    newValue: number | undefined,
    previousValue: number | undefined
  ) => void
  inputProps?: React.ComponentProps<'input'>
  sliderProps?: React.ComponentProps<typeof SliderPrimitive.Root>
}) {
  const [originalValue, setOriginalValue] = React.useState<number>()
  const [editingValue, setEditingValue] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(false)

  return (
    <div className={cn('flex flex-row gap-4', className)}>
      <Slider
        value={[value]}
        onValueChange={(values) => {
          const newValue = values[0]

          onValueChange(newValue)
          setEditingValue(newValue.toString())
        }}
        onValueCommit={(values) => {
          const newValue = values[0]

          if (onCommit) {
            onCommit(newValue, undefined) // TODO: Don't know how to capture originalValue with Slider properly
          }
        }}
        min={min}
        max={max}
        className="grow"
        {...sliderProps}
      />

      <Input
        value={isFocused ? editingValue : value}
        onChange={(e) => {
          const targetValue = e.target.value
          setEditingValue(targetValue)
          const newValue = targetValue ? parseInt(e.target.value) : 0
          onValueChange(newValue)
        }}
        min={min}
        max={max}
        className="max-w-20"
        type="number"
        onFocus={(e) => {
          setOriginalValue(parseInt(e.target.value))
          setEditingValue(value.toString())
          setIsFocused(true)
        }}
        onBlur={(e) => {
          const newValue = parseInt(e.target.value)

          if (newValue !== originalValue && onCommit) {
            onCommit(newValue, originalValue)
          }

          setIsFocused(false)
        }}
        {...inputProps}
      />
    </div>
  )
}

export { SliderWithInput, ManagedSliderWithInput }
