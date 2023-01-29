import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { Minus, Plus } from 'phosphor-react'

import { CycleContext } from '../../../../context/CyclesContext'
import { InputTimeContainer, InputTimeButton, InputTimeMain } from './styles'

export function InputTime() {
  const { activeCycle } = useContext(CycleContext)
  const { register, setValue, getValues } = useFormContext()

  function handleAddFiveMinutesToTimer() {
    const value = getValues('minutesAmount')
    value < 60 && setValue('minutesAmount', Number(value) + 5)
  }

  function handleRemoveFiveMinutesFromTimer() {
    const value = getValues('minutesAmount')
    value > 5 && setValue('minutesAmount', Number(value) - 5)
  }

  return (
    <InputTimeContainer>
      <InputTimeButton
        onClick={handleRemoveFiveMinutesFromTimer}
        disabled={!!activeCycle}
      >
        <Minus size={16} />
      </InputTimeButton>

      <InputTimeMain
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={5}
        max={60}
        min={5}
        disabled={!!activeCycle}
        {...(register('minutesAmount'),
        {
          onBlur: (e) => {
            if (+e.target.value > 60) setValue('minutesAmount', 60)
            else if (+e.target.value < 5) setValue('minutesAmount', 5)
          },
        })}
      />

      <InputTimeButton
        onClick={handleAddFiveMinutesToTimer}
        disabled={!!activeCycle}
      >
        <Plus size={16} />
      </InputTimeButton>
    </InputTimeContainer>
  )
}
