import { cn } from '@/lib/utils'
import { Toggle } from './toggle'
import {
  ArrowBottomLeftIcon,
  ArrowBottomRightIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowTopLeftIcon,
  ArrowTopRightIcon,
  ArrowUpIcon,
  DotIcon,
} from '@radix-ui/react-icons'
import type { AlignmentT } from '@/lib/alignment'

function SelectAlignment({
  className,
  value,
  onChange,
}: {
  className?: string | undefined
  value: AlignmentT
  onChange: (newValue: AlignmentT) => void
}) {
  return (
    <div className={cn('grid grid-cols-3 grid-rows-3', className)}>
      <Toggle
        className="rounded-none rounded-tl-md"
        pressed={value === 'topLeft'}
        onPressedChange={() => onChange('topLeft')}
      >
        <ArrowTopLeftIcon />
      </Toggle>

      <Toggle
        className="rounded-none"
        pressed={value === 'top'}
        onPressedChange={() => onChange('top')}
      >
        <ArrowUpIcon />
      </Toggle>

      <Toggle
        className="rounded-none rounded-tr-md"
        pressed={value === 'topRight'}
        onPressedChange={() => onChange('topRight')}
      >
        <ArrowTopRightIcon />
      </Toggle>

      <Toggle
        className="rounded-none"
        pressed={value === 'left'}
        onPressedChange={() => onChange('left')}
      >
        <ArrowLeftIcon />
      </Toggle>

      <Toggle
        className="rounded-none"
        pressed={value === 'center'}
        onPressedChange={() => onChange('center')}
      >
        <DotIcon />
      </Toggle>

      <Toggle
        className="rounded-none"
        pressed={value === 'right'}
        onPressedChange={() => onChange('right')}
      >
        <ArrowRightIcon />
      </Toggle>

      <Toggle
        className="rounded-none rounded-bl-md"
        pressed={value === 'bottomLeft'}
        onPressedChange={() => onChange('bottomLeft')}
      >
        <ArrowBottomLeftIcon />
      </Toggle>

      <Toggle
        className="rounded-none"
        pressed={value === 'bottom'}
        onPressedChange={() => onChange('bottom')}
      >
        <ArrowDownIcon />
      </Toggle>

      <Toggle
        className="rounded-none rounded-br-md"
        pressed={value === 'bottomRight'}
        onPressedChange={() => onChange('bottomRight')}
      >
        <ArrowBottomRightIcon />
      </Toggle>
    </div>
  )
}

export { SelectAlignment }
