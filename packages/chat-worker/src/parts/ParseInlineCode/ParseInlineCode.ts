import { FormattedContentInternal } from '../FormatMessage/FormatMessage.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'

export const parseInlineCode = (text: string): FormattedContentInternal[] => {
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
