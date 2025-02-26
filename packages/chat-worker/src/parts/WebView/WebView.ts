import type { Message } from '../Message/Message.ts'

export interface WebView {
  readonly anthropicVersion: string
  readonly apiKey: string
  readonly cacheBaseUrl: string
  readonly cacheName: string
  readonly currentInput: string
  readonly images: readonly File[]
  readonly imageUrlCache: Map<string, string>
  readonly isScrolledToBottom: boolean
  readonly maxTokens: number
  readonly messages: readonly Message[]
  readonly modelId: string
  readonly port: any
  readonly previewImageUrl: string
  readonly scrollOffset: number
  readonly stream: boolean
  readonly time: number
  readonly url: string
  readonly inputSource: number
  readonly focused: boolean
}
