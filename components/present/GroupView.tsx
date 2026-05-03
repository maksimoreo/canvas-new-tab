import { getFlexAlignmentClasses } from '@/lib/alignment'
import type { GroupItem } from '@/lib/canvas'
import clsx from 'clsx'

export default function GroupView({ item }: { item: GroupItem }) {
  return (
    <div
      className={clsx('absolute', item.shadow && 'shadow-md')}
      style={{
        left: item.transform.local.position.x,
        top: item.transform.local.position.y,
        background: item.background,
        borderRadius: item.borderRadius,
        borderWidth: item.borderWidth,
        borderColor: item.borderColor,
        width: item.transform.width,
        height: item.transform.height,
      }}
    >
      <div
        className={clsx(
          'w-full h-full p-1 flex',
          getFlexAlignmentClasses(item.textAlignment)
        )}
        style={{
          color: item.color,
          fontWeight: item.bold ? 700 : 400,
          fontStyle: item.italic ? 'italic' : 'normal',
          fontSize: item.fontSize,
          textDecorationLine: item.underline ? 'underline' : 'none',
        }}
      >
        <div>{item.title}</div>
      </div>
    </div>
  )
}
