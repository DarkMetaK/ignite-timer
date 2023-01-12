import { useContext } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { HandPalm, Play } from 'phosphor-react'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'

import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'
import { Cycle, ITaskFormProps } from './types'

import { CycleContext } from '../../context/Cycles.context'

export function Home() {
  const { markCurrentCycleAsInterrupted, activeCycle, createNewCycle } =
    useContext(CycleContext)

  const schema = yup.object({
    task: yup
      .string()
      .min(1, 'Informe a tarefa')
      .required('Esse campo é obrigatório'),
    minutesAmount: yup
      .number()
      .integer()
      .min(5)
      .max(60)
      .required('Esse campo é obrigatório'),
  })

  const newCycleForm = useForm<ITaskFormProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      task: '',
      minutesAmount: 5,
    },
  })
  const {
    reset,
    handleSubmit,
    formState: { isValid },
  } = newCycleForm

  function handleCreateNewCycle({ task, minutesAmount }: ITaskFormProps) {
    const nowDateInfo = new Date()
    const newCycle: Cycle = {
      id: String(nowDateInfo.getTime()),
      task,
      minutesAmount,
      startedAt: nowDateInfo,
    }
    createNewCycle(newCycle)
    reset()
  }

  function handleInterruptCycle() {
    markCurrentCycleAsInterrupted()
    document.title = 'Timer'
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <Countdown />

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={!isValid}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
export { CycleContext }
