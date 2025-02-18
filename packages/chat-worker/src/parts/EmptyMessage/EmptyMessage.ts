import type { Message } from '../Message/Message.ts'
import * as MessageRole from '../MessageRole/MessageRole.ts'

export const emptyMessage: Message = {
  role: MessageRole.Human,
  webViewId: 0,
  content: [],
}
