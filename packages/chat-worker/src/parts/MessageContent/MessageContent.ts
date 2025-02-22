interface BaseMessageContent {
  readonly type: number
}

export interface TextMessageContent extends BaseMessageContent {
  readonly type: 1 // Text
  readonly content: string
}

export interface ImageMessageContent extends BaseMessageContent {
  readonly type: 3 // Image
  readonly file: File
  readonly fileName: string
  readonly mediaType: string
}

export type MessageContent = TextMessageContent | ImageMessageContent
