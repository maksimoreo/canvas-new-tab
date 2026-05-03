import { clsx, type ClassValue } from 'clsx'
import type { Rectangle } from '@/lib/canvas'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function gridRound(n: number, cellSize: number) {
  return Math.round(n / cellSize) * cellSize
}

export function noop() {}

// export function isCenterInside(target: CanvasItem, container: CanvasItem) {
// }

export function isInside(
  target: { x: number; y: number },
  container: Rectangle
) {
  return (
    container.x <= target.x &&
    target.x < container.x + container.width &&
    container.y <= target.y &&
    target.y < container.y + container.height
  )
}

export function isOverlapping(item1: Rectangle, item2: Rectangle) {
  const right1 = item1.x + item1.width
  const bottom1 = item1.y + item1.height
  const right2 = item2.x + item2.width
  const bottom2 = item2.y + item2.height

  return (
    right1 > item2.x &&
    item1.x < right2 &&
    bottom1 > item2.y &&
    item1.y < bottom2
  )
}

export function isFullyInside(target: Rectangle, container: Rectangle) {
  return (
    container.x <= target.x &&
    target.x + target.width <= container.x + container.width &&
    container.y <= target.y &&
    target.y + target.height <= container.y + container.height
  )
}

// Source: https://stackoverflow.com/a/31129384
export function areSetsEqual<T>(s1: Set<T>, s2: Set<T>) {
  return s1.size === s2.size && [...s1].every((i) => s2.has(i))
}

export const sleep = async (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), milliseconds))

export function findOrThrow<T>(items: T[], predicate: (item: T) => boolean) {
  const item = items.find(predicate)

  if (!item) {
    throw new Error('Item not found')
  }

  return item
}

// Source: https://stackoverflow.com/a/54738437
export function ensure<T>(argument: T | undefined | null): T {
  if (argument === undefined || argument === null) {
    throw new TypeError('This value was promised to be there.')
  }

  return argument
}

export function single<T>(items: T[]): T {
  if (items.length != 1) {
    throw new Error(`Expected exactly one item, got: ${items.length}`)
  }

  return items[0]
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max)
}

export function download(data: string, filename: string, type: string) {
  const file = new Blob([data], { type })
  const a = document.createElement('a')
  const url = URL.createObjectURL(file)
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }, 0)
}
