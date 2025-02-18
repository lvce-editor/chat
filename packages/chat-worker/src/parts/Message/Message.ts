import type { MessageContent } from '../MessageContent/MessageContent.ts'

export interface Message {
  readonly role: number
  readonly content: readonly MessageContent[]
  readonly webViewId: number
}
