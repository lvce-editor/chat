import type {
  FormattedCodeContent,
  FormattedInlineCodeContent,
  FormattedListContent,
  FormattedTextContent,
} from '../FormattedMessageContent/FormattedMessageContent.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'

type State = 'Normal' | 'InUnorderedList' | 'InOrderedList' | 'InCodeBlock'

export type FormattedContentInternal =
  | FormattedTextContent
  | FormattedCodeContent
  | FormattedListContent
  | FormattedInlineCodeContent

const parseInlineCode = (text: string): FormattedContentInternal[] => {
  const parts: FormattedContentInternal[] = []
  let current = 0
  let textContent = ''

  while (current < text.length) {
    if (text[current] === '`' && text[current - 1] !== '\\') {
      if (textContent) {
        parts.push({
          type: MessageContentType.Text,
          content: textContent,
        })
        textContent = ''
      }

      current++
      let codeContent = ''

      while (current < text.length && text[current] !== '`') {
        codeContent += text[current]
        current++
      }

      if (codeContent) {
        parts.push({
          type: MessageContentType.InlineCode,
          content: codeContent,
        })
      }
      current++
      continue
    }
    textContent += text[current]
    current++
  }

  if (textContent) {
    parts.push({
      type: MessageContentType.Text,
      content: textContent,
    })
  }

  return parts
}

export const formatMessage = (text: string): readonly FormattedContentInternal[] => {
  const blocks: FormattedContentInternal[] = []
  let state: State = 'Normal'
  let listItems: FormattedContentInternal[][] = []
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
          const content = trimmedLine.slice(2).replace(/\[[ x]\]\s*/, '')
          listItems = [parseInlineCode(content)]
        } else if (/^\d+\.\s/.test(trimmedLine)) {
          state = 'InOrderedList'
          listItems = [parseInlineCode(trimmedLine.replace(/^\d+\.\s/, ''))]
        } else if (trimmedLine.startsWith('```')) {
          state = 'InCodeBlock'
          language = trimmedLine.slice(3).trim()
          codeContent = ''
        } else if (trimmedLine) {
          blocks.push(...parseInlineCode(trimmedLine))
        }
        break

      case 'InUnorderedList':
        if (trimmedLine.startsWith('- ')) {
          const content = trimmedLine.slice(2).replace(/\[[ x]\]\s*/, '')
          listItems.push(parseInlineCode(content))
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
          listItems.push(parseInlineCode(trimmedLine.replace(/^\d+\.\s/, '')))
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
