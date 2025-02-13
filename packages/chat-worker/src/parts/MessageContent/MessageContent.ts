// TODO always use object for messages

export type MessageContent =
  | string
  | Array<{
      type: 'text' | 'code'
      content: string
      language?: string
    }>
