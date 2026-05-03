import IdGenerator from '@/lib/IdGenerator'

export const idGenerator = new IdGenerator()

export const linkIdGenerator = new IdGenerator(1)
export const groupIdGenerator = new IdGenerator(1)

export function nextId(prefix: string) {
  return `${prefix}${idGenerator.next()}`
}
