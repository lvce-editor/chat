interface BaseFormattedContent {
  readonly type: number
}

export interface FormattedTextContent extends BaseFormattedContent {
  readonly content: string
  readonly type: 1
}

export interface FormattedCodeContent extends BaseFormattedContent {
  readonly content: string
  readonly language: string
  readonly type: 2
}

export interface FormattedListContent extends BaseFormattedContent {
  readonly items: readonly string[]
  readonly ordered: boolean
  readonly type: 4
}

export interface FormattedImageContent extends BaseFormattedContent {
  readonly file: File
  readonly fileName: string
  readonly mediaType: string
  readonly type: 3
}

export type FormattedMessageContent = FormattedTextContent | FormattedCodeContent | FormattedListContent | FormattedImageContent
