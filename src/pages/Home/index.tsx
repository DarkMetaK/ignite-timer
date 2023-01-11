import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { HandPalm, Play } from 'phosphor-react'
import { differenceInSeconds } from 'date-fns'

import {
  HomeContainer,
  CountdownContainer,
  FormContainer,
  Separator,
  StartCountdownButton,
  TaskInput,
  MinutesAmountInput,
  StopCountdownButton,
} from './styles'
import { Cycle, ITaskFormProps } from './types'

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

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

  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<ITaskFormProps>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      task: '',
      minutesAmount: 5,
    },
  })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startedAt),
        )
      }, 1000)
    }

    return () => {
      clearInterval(interval)
      setAmountSecondsPassed(0)
    }
  }, [activeCycle])

  function handleCreateNewCycle({ task, minutesAmount }: ITaskFormProps) {
    const nowDateInfo = new Date()
    const newCycle: Cycle = {
      id: String(nowDateInfo.getTime()),
      task,
      minutesAmount,
      startedAt: nowDateInfo,
    }
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)
    reset()
  }

  function handleInterruptCycle() {
    setCycles(
      cycles.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60).toLocaleString(
    'default',
    {
      minimumIntegerDigits: 2,
    },
  )
  const secondsAmount = (currentSeconds % 60).toLocaleString('default', {
    minimumIntegerDigits: 2,
  })

  useEffect(() => {
    if (activeCycle) document.title = `${minutesAmount}:${secondsAmount}`
  }, [minutesAmount, secondsAmount, activeCycle])

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em </label>
          <TaskInput
            type="text"
            id="task"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestions"
            {...register('task')}
            disabled={!!activeCycle}
          />
          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
          </datalist>

          <label htmlFor="minutesAmount">durante </label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            max={60}
            min={5}
            {...register('minutesAmount')}
            disabled={!!activeCycle}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutesAmount[0]}</span>
          <span>{minutesAmount[1]}</span>
          <Separator>:</Separator>
          <span>{secondsAmount[0]}</span>
          <span>{secondsAmount[1]}</span>
        </CountdownContainer>

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
