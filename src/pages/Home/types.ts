export interface ITaskFormProps {
  task: string
  minutesAmount: number
}

export interface Cycle extends ITaskFormProps {
  id: string
  startedAt: Date
  interruptedDate?: Date
  finishedDate?: Date
}
