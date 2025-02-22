interface BaseParsedContent {
  readonly type: number
}

export interface ParsedTextContent extends BaseParsedContent {
  readonly type: 1
  readonly content: string
}

export interface ParsedCodeContent extends BaseParsedContent {
  readonly type: 2
  readonly content: string
  readonly language: string
}

export interface ParsedListContent extends BaseParsedContent {
  readonly type: 4
  readonly items: readonly string[]
  readonly ordered: boolean
}

export interface ParsedImageContent extends BaseParsedContent {
  readonly type: 3
  readonly file: File
  readonly fileName: string
  readonly mediaType: string
}

export type ParsedMessageContent = ParsedTextContent | ParsedCodeContent | ParsedListContent | ParsedImageContent

export interface ParsedMessage {
  readonly role: number
  readonly webViewId: number
  readonly blocks: readonly ParsedMessageContent[]
}
