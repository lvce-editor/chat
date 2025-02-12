export interface CodeBlock {
  type: 'code'
  language: string
  content: string
}

export interface TextBlock {
  type: 'text'
  content: string
}

export type MessageBlock = CodeBlock | TextBlock

export const formatMessage = (text: string): MessageBlock[] => {
  const parts = text.split(/(```\w*\n[\s\S]*?\n```)/g)
  const blocks: MessageBlock[] = []

  for (const part of parts) {
    if (part.startsWith('```')) {
      const match = part.match(/```(\w*)\n([\s\S]*?)\n```/)
      if (match) {
        const [_, language, code] = match
        blocks.push({
          type: 'code',
          language: language || 'text',
          content: code,
        })
      }
    } else if (part.trim()) {
      blocks.push({
        type: 'text',
        content: part,
      })
    }
  }

  return blocks
}
