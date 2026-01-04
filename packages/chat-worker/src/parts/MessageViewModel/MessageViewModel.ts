// View-specific model with display-ready data
export interface MessageViewModel {
  readonly blocks: readonly MessageBlockViewModel[]
  readonly role: number
  readonly webViewId: number
}

export interface MessageBlockViewModel {
  readonly content: string
  readonly display: {
    readonly blobUrl?: string
    readonly language?: string
    readonly className?: string
    readonly tokens?: readonly any[]
  }
  readonly items?: readonly string[]
  readonly ordered?: boolean
  readonly type: number
}
