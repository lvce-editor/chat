import type { Message } from '../Message/Message.ts'
import * as MessageRole from '../MessageRole/MessageRole.ts'

export const emptyMessage: Message = {
  content: [],
  role: MessageRole.Human,
  webViewId: 0,
}
