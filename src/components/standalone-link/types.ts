import { ReactElement } from 'react'
import { TextProps } from 'components/text'

export interface StandaloneLinkProps {
  className?: string
  color: 'primary' | 'secondary'
  href: string
  icon: ReactElement
  iconPosition: 'leading' | 'trailing'
  text: string
  textSize?: TextProps['size']
  textWeight?: TextProps['weight']
}
