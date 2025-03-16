import type { Message } from '../Message/Message.ts'
import type { SavedMessage } from '../SavedMessage/SavedMessage.ts'
import * as SerializeMessage from '../SerializeMessage/SerializeMessage.ts'

export const serializeMessages = (messages: readonly Message[]): readonly SavedMessage[] => {
  if (!messages) {
    return []
  }
  return messages.map(SerializeMessage.serializeMessage)
}
