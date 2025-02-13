import type { Message } from '../Message/Message.ts'

export interface SavedState {
  readonly messages: readonly Message[]
}
