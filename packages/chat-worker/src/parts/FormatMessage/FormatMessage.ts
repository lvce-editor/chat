import type { MessageContent } from '../MessageContent/MessageContent.ts'

export const formatMessage = (text: string): readonly MessageContent[] => {
  const parts = text.split(/(```\w*\n[\s\S]*?\n```)/g)
  const blocks: MessageContent[] = []

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
