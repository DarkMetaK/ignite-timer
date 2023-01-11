import { ButtonContainer } from './styles'
import { IButtonProps } from './types'

export function Button({ variant = 'primary' }: IButtonProps) {
  return <ButtonContainer variant={variant}>Botão</ButtonContainer>
}
