import type { MessageContent } from '../MessageContent/MessageContent.ts'

export interface Message {
  readonly content: readonly MessageContent[]
  readonly role: number
  readonly webViewId: number
}
