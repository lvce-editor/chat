export interface WebView {
  readonly time: number
  readonly url: string
  readonly port: any
  readonly apiKey: string
  readonly modelId: string
  readonly anthropicVersion: string
  readonly stream: boolean
}
