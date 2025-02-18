interface SavedMessageContent {
  readonly type: string
}

interface SavedTextContent extends SavedMessageContent {
  readonly type: 'text'
  readonly content: string
}

interface SavedCodeContent extends SavedMessageContent {
  readonly type: 'code'
  readonly content: string
  readonly language: string
}

interface SavedImageContent extends SavedMessageContent {
  readonly type: 'image'
  readonly fileName: string
  readonly mediaType: string
}

export type SavedContent = SavedTextContent | SavedCodeContent | SavedImageContent

export interface SavedMessage {
  readonly role: number
  readonly content: readonly SavedContent[]
}
