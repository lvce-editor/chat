import type { MessageContent } from '../MessageContent/MessageContent.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'

type State = 'Normal' | 'InUnorderedList' | 'InOrderedList' | 'InCodeBlock'

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
          state = 'InUnorderedList'
          listItems = [trimmedLine.slice(2)]
        } else if (/^\d+\.\s/.test(trimmedLine)) {
          state = 'InOrderedList'
          listItems = [trimmedLine.replace(/^\d+\.\s/, '')]
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

      case 'InUnorderedList':
        if (trimmedLine.startsWith('- ')) {
          listItems.push(trimmedLine.slice(2))
        } else {
          blocks.push({
            type: MessageContentType.List,
            items: listItems,
            ordered: false,
          })
          listItems = []
          state = 'Normal'
          i-- // Reprocess this line in Normal state
        }
        break

      case 'InOrderedList':
        if (/^\d+\.\s/.test(trimmedLine)) {
          listItems.push(trimmedLine.replace(/^\d+\.\s/, ''))
        } else {
          blocks.push({
            type: MessageContentType.List,
            items: listItems,
            ordered: true,
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

    if (i === lines.length - 1) {
      switch (state) {
        case 'InCodeBlock':
          blocks.push({
            type: MessageContentType.Code,
            language: language || 'text',
            content: codeContent.trim(),
          })
          break
        case 'InUnorderedList':
          blocks.push({
            type: MessageContentType.List,
            items: listItems,
            ordered: false,
          })
          break
        case 'InOrderedList':
          blocks.push({
            type: MessageContentType.List,
            items: listItems,
            ordered: true,
          })
          break
      }
    }
  }

  return blocks
}
