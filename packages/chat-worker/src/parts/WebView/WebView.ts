import type { Message } from '../Message/Message.ts'
import type { Provider } from '../Provider/Provider.ts'

export interface WebView {
  readonly anthropicVersion: string
  readonly apiKey: string
  readonly cacheBaseUrl: string
  readonly cacheName: string
  readonly currentInput: string
  readonly focused: boolean
  readonly images: readonly File[]
  readonly imageUrlCache: Map<string, string>
  readonly inputSource: number
  readonly isScrolledToBottom: boolean
  readonly maxTokens: number
  readonly messages: readonly Message[]
  readonly modelId: string
  readonly modelName: string
  readonly openRouterApiKey: string
  readonly openRouterModelId: string
  readonly openRouterModelName: string
  readonly openRouterUrl: string
  readonly port: any
  readonly previewImageUrl: string
  readonly provider: Provider
  readonly scrollOffset: number
  readonly stream: boolean
  readonly time: number
  readonly tools: readonly any[]
  readonly url: string
}
