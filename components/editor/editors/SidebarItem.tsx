import clsx from 'clsx'

export default function SidebarItem({
  onClick,
  selected,
  title,
}: {
  onClick?: () => void
  selected: boolean
  title: string
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full px-4 py-2 text-left',
        selected && 'bg-neutral-100 dark:bg-neutral-800'
      )}
    >
      {title}
    </button>
  )
}
