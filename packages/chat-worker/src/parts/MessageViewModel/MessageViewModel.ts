// View-specific model with display-ready data
export interface MessageViewModel {
  readonly role: 'human' | 'ai'
  readonly blocks: readonly MessageBlockViewModel[]
  readonly webViewId: number
}

export interface MessageBlockViewModel {
  readonly type: 'text' | 'code' | 'image'
  readonly content: string
  readonly display: {
    readonly blobUrl?: string
    readonly language?: string
    readonly className?: string
  }
}
