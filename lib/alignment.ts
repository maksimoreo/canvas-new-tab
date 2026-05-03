export type AlignmentT =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'topRight'
  | 'bottomRight'
  | 'bottomLeft'
  | 'topLeft'
  | 'center'

export type HorizontalAlignmentT = 'left' | 'center' | 'right'

export type VerticalAlignmentT = 'top' | 'center' | 'bottom'

export type AlignmentTypeT = 'all' | 'horizontal' | 'vertical'

export function getFlexAlignmentClasses(alignment: AlignmentT) {
  switch (alignment) {
    case 'top':
      return ['justify-center', 'items-start']
    case 'right':
      return ['justify-end', 'items-center']
    case 'bottom':
      return ['justify-center', 'items-end']
    case 'left':
      return ['justify-start', 'items-center']
    case 'topRight':
      return ['justify-end', 'items-start']
    case 'bottomRight':
      return ['justify-end', 'items-end']
    case 'bottomLeft':
      return ['justify-start', 'items-end']
    case 'topLeft':
      return ['justify-start', 'items-start']
    case 'center':
      return ['justify-center', 'items-center']
    default:
      return []
  }
}

export function getFlexHorizontalAlignmentClass(
  alignment: HorizontalAlignmentT
) {
  switch (alignment) {
    case 'left':
      return 'justify-start'
    case 'center':
      return 'justify-center'
    case 'right':
      return 'justify-end'
  }
}
