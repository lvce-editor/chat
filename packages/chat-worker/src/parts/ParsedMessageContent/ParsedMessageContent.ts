interface BaseParsedContent {
  readonly type: number
}

export interface ParsedTextContent extends BaseParsedContent {
  readonly content: string
  readonly type: 1
}

export interface ParsedCodeContent extends BaseParsedContent {
  readonly content: string
  readonly language: string
  readonly type: 2
}

export interface ParsedListContent extends BaseParsedContent {
  readonly items: readonly string[]
  readonly ordered: boolean
  readonly type: 4
}

export interface ParsedImageContent extends BaseParsedContent {
  readonly file: File
  readonly fileName: string
  readonly mediaType: string
  readonly type: 3
}

export type ParsedMessageContent = ParsedTextContent | ParsedCodeContent | ParsedListContent | ParsedImageContent

export interface ParsedMessage {
  readonly blocks: readonly ParsedMessageContent[]
  readonly role: number
  readonly webViewId: number
}
