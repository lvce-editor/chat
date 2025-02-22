import type { MessageContent } from '../MessageContent/MessageContent.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'

type State = 'Normal' | 'InList' | 'InCodeBlock'

export const formatMessage = (text: string): readonly MessageContent[] => {
  const blocks: MessageContent[] = []
  let state: State = 'Normal'
  let listItems: string[] = []
  let codeContent = ''
  let language = ''

  const lines = text.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    switch (state) {
      case 'Normal':
        if (trimmedLine.startsWith('- ')) {
          state = 'InList'
          listItems = [trimmedLine.slice(2)]
        } else if (trimmedLine.startsWith('```')) {
          state = 'InCodeBlock'
          language = trimmedLine.slice(3).trim()
          codeContent = ''
        } else if (trimmedLine) {
          blocks.push({
            type: MessageContentType.Text,
            content: trimmedLine,
          })
        }
        break

      case 'InList':
        if (trimmedLine.startsWith('- ')) {
          listItems.push(trimmedLine.slice(2))
        } else {
          blocks.push({
            type: MessageContentType.List,
            items: listItems,
          })
          listItems = []
          state = 'Normal'
          i-- // Reprocess this line in Normal state
        }
        break

      case 'InCodeBlock':
        if (trimmedLine === '```') {
          blocks.push({
            type: MessageContentType.Code,
            language: language || 'text',
            content: codeContent.trim(),
          })
          state = 'Normal'
        } else {
          if (codeContent) {
            codeContent += '\n'
          }
          codeContent += line
        }
        break
    }
  }

  // Handle any remaining content based on final state
  if (state === 'InList' && listItems.length > 0) {
    blocks.push({
      type: MessageContentType.List,
      items: listItems,
    })
  } else if (state === 'InCodeBlock' && codeContent) {
    blocks.push({
      type: MessageContentType.Code,
      language: language || 'text',
      content: codeContent.trim(),
    })
  }

  return blocks
}
