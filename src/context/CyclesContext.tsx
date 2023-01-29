import { createContext, ReactNode, useEffect, useReducer } from 'react'

import { cyclesReducer } from '../reducers/Cycles/reducer'
import {
  addNewCycleAction,
  finisheCycleAction,
  interruptCycleAction,
} from '../reducers/Cycles/actions'
import { Cycle } from '../pages/Home/types'

interface ICyclesContextProvider {
  children: ReactNode
}

interface ICycleContext {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
  markCurrentCycleAsInterrupted: () => void
  createNewCycle: (cycle: Cycle) => void
}

export const CycleContext = createContext({} as ICycleContext)

export function CycleContextProvider({ children }: ICyclesContextProvider) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storedStateAsJSON = localStorage.getItem(
        '@ignite-timer:cycles-state=1.0.0',
      )

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }

      return {
        cycles: [],
        activeCycleId: null,
      }
    },
  )

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state=1.0.0', stateJSON)
  }, [cyclesState])

  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function createNewCycle(newCycle: Cycle) {
    dispatch(addNewCycleAction(newCycle))
  }

  function markCurrentCycleAsFinished() {
    dispatch(finisheCycleAction())
  }

  function markCurrentCycleAsInterrupted() {
    dispatch(interruptCycleAction())
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        markCurrentCycleAsFinished,
        activeCycleId,
        markCurrentCycleAsInterrupted,
        createNewCycle,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
