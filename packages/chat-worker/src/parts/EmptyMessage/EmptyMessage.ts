import type { Message } from '../Message/Message.ts'

export const emptyMessage: Message = {
  role: 'human',
  webViewId: 0,
  content: [],
}
