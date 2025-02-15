import type { Message } from '../Message/Message.ts'
import type { SavedMessage } from '../SavedMessage/SavedMessage.ts'
import * as SerializeContent from '../SerializeContent/SerializeContent.ts'

export const serializeMessage = (message: Message): SavedMessage => {
  return {
    role: message.role,
    content: message.content.map(SerializeContent.serializeContent),
  }
}
