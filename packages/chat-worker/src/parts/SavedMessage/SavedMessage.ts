export interface SavedMessageContent {
  readonly type: string
}

export interface SavedTextContent extends SavedMessageContent {
  readonly type: 'text'
  readonly content: string
}

export interface SavedCodeContent extends SavedMessageContent {
  readonly type: 'code'
  readonly content: string
  readonly language: string
}

export interface SavedImageContent extends SavedMessageContent {
  readonly type: 'image'
  readonly fileName: string
  readonly mediaType: string
}

export type SavedContent = SavedTextContent | SavedCodeContent | SavedImageContent

export interface SavedMessage {
  readonly role: 'human' | 'ai'
  readonly content: readonly SavedContent[]
}
