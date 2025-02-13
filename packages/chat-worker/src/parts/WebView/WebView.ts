import type { Message } from '../Message/Message.ts'

export interface WebView {
  readonly time: number
  readonly url: string
  readonly port: any
  readonly apiKey: string
  readonly modelId: string
  readonly anthropicVersion: string
  readonly stream: boolean
  readonly maxTokens: number
  readonly messages: readonly Message[]
  readonly scrollOffset: number
}
