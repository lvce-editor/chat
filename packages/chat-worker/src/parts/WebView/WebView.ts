export interface WebView {
  readonly time: number
  readonly url: string
  readonly port: any
  readonly apiKey: string
  readonly modelId: string
  readonly anthropicVersion: string
  readonly stream: boolean
  readonly messages: Array<{
    role: 'human' | 'ai'
    content:
      | string
      | Array<{
          type: 'text' | 'code'
          content: string
          language?: string
        }>
  }>
}
