import styled from 'styled-components'

export const InputTimeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid ${(props) => props.theme['gray-500']};
  width: 4.5rem;
`

export const InputTimeButton = styled.button`
  all: unset;

  svg {
    color: ${(props) => props.theme['gray-500']};
    line-height: 0;
  }
`

export const InputTimeMain = styled.input`
  background-color: transparent;
  height: 2.5rem;
  border: none;
  font-weight: bold;
  font-size: 1.125rem;
  color: ${(props) => props.theme['gray-100']};
  position: relative;
  width: 100%;

  &:focus {
    box-shadow: none;
    border-color: ${(props) => props.theme['green-500']};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`
