import { createContext, ReactNode, useState } from 'react'

import { Cycle } from '../pages/Home/types'

interface ICyclesContextProvider {
  children: ReactNode
}

export interface ICycleContext {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  changeActiveCycleId: (value: string | null) => void
  markCurrentCycleAsFinished: () => void
  markCurrentCycleAsInterrupted: () => void
  createNewCycle: (cycle: Cycle) => void
}

export const CycleContext = createContext({} as ICycleContext)

export function CycleContextProvider({ children }: ICyclesContextProvider) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }

  function markCurrentCycleAsInterrupted() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  function createNewCycle(newCycle: Cycle) {
    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)
  }

  function changeActiveCycleId(value: string | null) {
    setActiveCycleId(value)
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        markCurrentCycleAsFinished,
        activeCycleId,
        changeActiveCycleId,
        markCurrentCycleAsInterrupted,
        createNewCycle,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
