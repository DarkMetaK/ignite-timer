import { useState, useEffect, useContext } from 'react'
import { differenceInSeconds } from 'date-fns'

import { CountdownContainer, Separator } from './styles'
import { CycleContext } from '../../../../context/CyclesContext'

export function Countdown() {
  const { activeCycle, markCurrentCycleAsFinished, activeCycleId } =
    useContext(CycleContext)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startedAt))
    }

    return 0
  })

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

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startedAt),
        )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
          document.title = 'Timer'
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
      setAmountSecondsPassed(0)
    }
  }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished])

  return (
    <CountdownContainer>
      <span>{minutesAmount[0]}</span>
      <span>{minutesAmount[1]}</span>
      <Separator>:</Separator>
      <span>{secondsAmount[0]}</span>
      <span>{secondsAmount[1]}</span>
    </CountdownContainer>
  )
}
