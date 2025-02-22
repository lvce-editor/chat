interface SavedMessageContent {
  readonly type: number
}

interface SavedTextContent extends SavedMessageContent {
  readonly type: 1
  readonly content: string
}

interface SavedImageContent extends SavedMessageContent {
  readonly type: 3
  readonly fileName: string
  readonly mediaType: string
}

export type SavedContent = SavedTextContent | SavedImageContent

export interface SavedMessage {
  readonly role: number
  readonly content: readonly SavedContent[]
}
