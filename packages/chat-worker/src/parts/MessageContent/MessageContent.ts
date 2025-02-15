export interface BaseMessageContent {
  readonly type: string
}

export interface TextMessageContent extends BaseMessageContent {
  readonly type: 'text'
  readonly content: string
}

export interface CodeMessageContent extends BaseMessageContent {
  readonly type: 'code'
  readonly content: string
  readonly language?: string
}

export interface ImageMessageContent extends BaseMessageContent {
  readonly type: 'image'
  readonly file: File
  readonly mediaType: string
}

export type MessageContent = ImageMessageContent | CodeMessageContent | TextMessageContent
