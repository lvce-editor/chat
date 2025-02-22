// View-specific model with display-ready data
export interface MessageViewModel {
  readonly role: number
  readonly blocks: readonly MessageBlockViewModel[]
  readonly webViewId: number
}

export interface MessageBlockViewModel {
  readonly type: number
  readonly content: string
  readonly items?: readonly string[]
  readonly display: {
    readonly blobUrl?: string
    readonly language?: string
    readonly className?: string
    readonly tokens?: readonly any[]
  }
}
