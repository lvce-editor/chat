interface BaseMessageContent {
  readonly type: number
}

export interface TextMessageContent extends BaseMessageContent {
  readonly content: string
  readonly type: 1 // Text
}

export interface ImageMessageContent extends BaseMessageContent {
  readonly file: File
  readonly fileName: string
  readonly mediaType: string
  readonly type: 3 // Image
}

export interface ToolResultMessageContent extends BaseMessageContent {
  readonly content: string
  readonly tool_use_id: string
  readonly tool_use_name: string
  readonly type: 7
}

export interface ToolUseMessageContent extends BaseMessageContent {
  readonly input: any
  readonly tool_use_id: string
  readonly tool_use_name: string
  readonly type: 8
}

export type MessageContent = TextMessageContent | ImageMessageContent | ToolResultMessageContent | ToolUseMessageContent
