interface SavedMessageContent {
  readonly type: number
}

interface SavedTextContent extends SavedMessageContent {
  readonly type: 1
  readonly content: string
}

interface SavedCodeContent extends SavedMessageContent {
  readonly type: 2
  readonly content: string
  readonly language: string
}

interface SavedImageContent extends SavedMessageContent {
  readonly type: 3
  readonly fileName: string
  readonly mediaType: string
}

export type SavedContent = SavedTextContent | SavedCodeContent | SavedImageContent

export interface SavedMessage {
  readonly role: number
  readonly content: readonly SavedContent[]
}
