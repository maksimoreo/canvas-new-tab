import { useDocumentContext } from '@/components/documentContext'

export default function DocumentBackground() {
  const { background } = useDocumentContext()

  return <div className="absolute w-full h-full" style={{ background }}></div>
}
