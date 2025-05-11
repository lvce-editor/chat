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

export interface ToolResultMessageContent extends BaseMessageContent {
  readonly type: 7
  readonly tool_use_id: string
  readonly content: string
}

export interface ToolUseMessageContent extends BaseMessageContent {
  readonly type: 8
  readonly tool_use_id: string
  readonly input: any
}

export type MessageContent = TextMessageContent | ImageMessageContent | ToolResultMessageContent | ToolUseMessageContent
