import type { MessageContent } from '../MessageContent/MessageContent.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'

export const formatMessage = (text: string): readonly MessageContent[] => {
  const blocks: MessageContent[] = []
  let current = 0
  let listItems: string[] = []

  const lines = text.split('\n')

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (trimmedLine.startsWith('- ')) {
      listItems.push(trimmedLine.slice(2))
      continue
    }

    if (listItems.length > 0) {
      blocks.push({
        type: MessageContentType.List,
        items: listItems,
      })
      listItems = []
    }

    if (trimmedLine.startsWith('```')) {
      // Look for code block start
      const codeBlockStart = text.indexOf('```', current)

      if (codeBlockStart === -1) {
        // No more code blocks, add remaining text if any
        const remainingText = text.slice(current).trim()
        if (remainingText) {
          blocks.push({
            type: MessageContentType.Text,
            content: remainingText,
          })
        }
        break
      }

      // Add text before code block if any
      const textBeforeCode = text.slice(current, codeBlockStart).trim()
      if (textBeforeCode) {
        blocks.push({
          type: MessageContentType.Text,
          content: textBeforeCode,
        })
      }

      // Extract language identifier
      const languageStart = codeBlockStart + 3
      const newlinePos = text.indexOf('\n', languageStart)
      const language = newlinePos === -1 ? text.slice(languageStart).trim() : text.slice(languageStart, newlinePos).trim()

      // Find code block end or use end of text
      const codeBlockEnd = text.indexOf('```', newlinePos === -1 ? languageStart : newlinePos)
      const codeStart = newlinePos === -1 ? languageStart : newlinePos + 1
      const codeEnd = codeBlockEnd === -1 ? text.length : codeBlockEnd

      // Extract code content
      const code = text.slice(codeStart, codeEnd).trim()

      if (code) {
        blocks.push({
          type: MessageContentType.Code,
          language: language || 'text',
          content: code,
        })
      }

      current = codeBlockEnd === -1 ? text.length : codeBlockEnd + 3
    } else if (trimmedLine) {
      blocks.push({
        type: MessageContentType.Text,
        content: trimmedLine,
      })
    }
    current += line.length + 1
  }

  if (listItems.length > 0) {
    blocks.push({
      type: MessageContentType.List,
      items: listItems,
    })
  }

  return blocks
}
