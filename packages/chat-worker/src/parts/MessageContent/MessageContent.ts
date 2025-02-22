interface BaseMessageContent {
  readonly type: number
}

export interface TextMessageContent extends BaseMessageContent {
  readonly type: 1 // Text
  readonly content: string
}

export interface CodeMessageContent extends BaseMessageContent {
  readonly type: 2 // Code
  readonly content: string
  readonly language?: string
}

export interface ImageMessageContent extends BaseMessageContent {
  readonly type: 3 // Image
  readonly file: File
  readonly fileName: string
  readonly mediaType: string
}

export interface ListMessageContent extends BaseMessageContent {
  readonly type: 4 // List
  readonly items: readonly string[]
}

export type MessageContent = ImageMessageContent | CodeMessageContent | TextMessageContent | ListMessageContent
