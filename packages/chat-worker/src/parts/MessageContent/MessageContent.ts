// TODO always use object for messages
export interface BaseMessageContent {
  readonly type: string
  readonly content: string
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
  readonly content: string // TODO maybe store the image as blob instead
}
