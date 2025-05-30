interface BaseFormattedContent {
  readonly type: number
}

export interface FormattedTextContent extends BaseFormattedContent {
  readonly type: 1
  readonly content: string
}

export interface FormattedCodeContent extends BaseFormattedContent {
  readonly type: 2
  readonly content: string
  readonly language: string
}

export interface FormattedListContent extends BaseFormattedContent {
  readonly type: 4
  readonly items: readonly string[]
  readonly ordered: boolean
}

export interface FormattedImageContent extends BaseFormattedContent {
  readonly type: 3
  readonly file: File
  readonly fileName: string
  readonly mediaType: string
}

export type FormattedMessageContent = FormattedTextContent | FormattedCodeContent | FormattedListContent | FormattedImageContent
