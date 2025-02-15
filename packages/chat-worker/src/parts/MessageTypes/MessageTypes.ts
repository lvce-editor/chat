// Base message types
export interface BaseMessage {
  readonly id: string
  readonly role: 'human' | 'ai'
  readonly timestamp: number
}

// Content types
export interface BaseContent {
  readonly type: string
}

export interface TextContent extends BaseContent {
  readonly type: 'text'
  readonly text: string
}

export interface CodeContent extends BaseContent {
  readonly type: 'code'
  readonly language: string
  readonly code: string
}

export interface ImageContent extends BaseContent {
  readonly type: 'image'
  readonly base64Data: string
  readonly mediaType: string
}

export type MessageContent = TextContent | CodeContent | ImageContent

// Internal message representation
export interface StoredMessage extends BaseMessage {
  readonly content: readonly MessageContent[]
}

// API message format for Claude
export interface ApiTextContent {
  readonly type: 'text'
  readonly text: string
}

export interface ApiImageContent {
  readonly type: 'image'
  readonly source: {
    readonly type: 'base64'
    readonly media_type: string
    readonly data: string
  }
}

export type ApiContent = ApiTextContent | ApiImageContent

export interface ApiMessage {
  readonly role: 'user' | 'assistant'
  readonly content: readonly ApiContent[]
}

// Display format for rendering
export interface DisplayTextBlock {
  readonly type: 'text'
  readonly content: string
}

export interface DisplayCodeBlock {
  readonly type: 'code'
  readonly content: string
  readonly language: string
}

export interface DisplayImageBlock {
  readonly type: 'image'
  readonly src: string
}

export type DisplayBlock = DisplayTextBlock | DisplayCodeBlock | DisplayImageBlock

export interface DisplayMessage {
  readonly id: string
  readonly role: 'human' | 'ai'
  readonly blocks: readonly DisplayBlock[]
}
