import type {
  FormattedCodeContent,
  FormattedListContent,
  FormattedTextContent,
} from '../FormattedMessageContent/FormattedMessageContent.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'

type State = 'Normal' | 'InUnorderedList' | 'InOrderedList' | 'InCodeBlock'

export type FormattedContentInternal = FormattedTextContent | FormattedCodeContent | FormattedListContent

export const formatMessage = (text: string): readonly FormattedContentInternal[] => {
  const blocks: FormattedContentInternal[] = []
  let state: State = 'Normal'
  let listItems: string[] = []
  let codeContent = ''
  let language = ''

  const lines = text.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()

    switch (state) {
      case 'InCodeBlock':
        if (trimmedLine === '```') {
          blocks.push({
            content: codeContent.trim(),
            language: language || 'text',
            type: MessageContentType.Code,
          })
          state = 'Normal'
        } else {
          if (codeContent) {
            codeContent += '\n'
          }
          codeContent += line
        }
        break

      case 'InOrderedList':
        if (/^\d+\.\s/.test(trimmedLine)) {
          listItems.push(trimmedLine.replace(/^\d+\.\s/, ''))
        } else {
          blocks.push({
            items: listItems,
            ordered: true,
            type: MessageContentType.List,
          })
          listItems = []
          state = 'Normal'
          i-- // Reprocess this line in Normal state
        }
        break

      case 'InUnorderedList':
        if (trimmedLine.startsWith('- ')) {
          const content = trimmedLine.slice(2).replace(/\[[ x]\]\s*/, '')
          listItems.push(content)
        } else {
          blocks.push({
            items: listItems,
            ordered: false,
            type: MessageContentType.List,
          })
          listItems = []
          state = 'Normal'
          i-- // Reprocess this line in Normal state
        }
        break

      case 'Normal':
        if (trimmedLine.startsWith('- ')) {
          state = 'InUnorderedList'
          const content = trimmedLine.slice(2).replace(/\[[ x]\]\s*/, '')
          listItems = [content]
        } else if (/^\d+\.\s/.test(trimmedLine)) {
          state = 'InOrderedList'
          listItems = [trimmedLine.replace(/^\d+\.\s/, '')]
        } else if (trimmedLine.startsWith('```')) {
          state = 'InCodeBlock'
          language = trimmedLine.slice(3).trim()
          codeContent = ''
        } else if (trimmedLine) {
          blocks.push({
            content: trimmedLine,
            type: MessageContentType.Text,
          })
        }
        break
    }

    if (i === lines.length - 1) {
      switch (state) {
        case 'InCodeBlock':
          blocks.push({
            content: codeContent.trim(),
            language: language || 'text',
            type: MessageContentType.Code,
          })
          break
        case 'InOrderedList':
          blocks.push({
            items: listItems,
            ordered: true,
            type: MessageContentType.List,
          })
          break
        case 'InUnorderedList':
          blocks.push({
            items: listItems,
            ordered: false,
            type: MessageContentType.List,
          })
          break
      }
    }
  }

  return blocks
}
