import { getFlexAlignmentClasses } from '@/lib/alignment'
import type { LinkItem } from '@/lib/canvas'
import clsx from 'clsx'

export default function LinkView({ item }: { item: LinkItem }) {
  return (
    <a
      className={clsx(
        'absolute flex',
        item.growOnHover && 'hover:scale-110 duration-100 hover:z-10',
        getFlexAlignmentClasses(item.textAlignment),
        item.shadow && 'shadow-md',
      )}
      style={{
        left: item.transform.global.position.x,
        top: item.transform.global.position.y,
        background: item.background,
        borderRadius: item.borderRadius,
        borderWidth: item.borderWidth,
        borderColor: item.borderColor,
        width: item.transform.width,
        height: item.transform.height,
        color: item.color,
        fontWeight: item.bold ? 700 : 400,
        fontStyle: item.italic ? 'italic' : 'normal',
        fontSize: item.fontSize,
        textDecorationLine: item.underline ? 'underline' : 'none',
      }}
      href={item.url}
    >
      <div className={'flex flex-col items-center'}>
        {item.showIcon ? (
          <div
            style={{ width: item.iconSize, fill: item.iconFill }}
            dangerouslySetInnerHTML={{ __html: item.iconHtml }}
          ></div>
        ) : null}

        <span>{item.title}</span>
      </div>
    </a>
  )
}
