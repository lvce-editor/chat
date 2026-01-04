interface SavedMessageContent {
  readonly type: number
}

interface SavedTextContent extends SavedMessageContent {
  readonly content: string
  readonly type: 1
}

interface SavedImageContent extends SavedMessageContent {
  readonly fileName: string
  readonly mediaType: string
  readonly type: 3
}

export type SavedContent = SavedTextContent | SavedImageContent

export interface SavedMessage {
  readonly content: readonly SavedContent[]
  readonly role: number
}
