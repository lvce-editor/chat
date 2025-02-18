import type { MessageContent } from '../MessageContent/MessageContent.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'

export const getNewContent = (input: string, images: readonly File[]): readonly MessageContent[] => {
  const newContent: MessageContent[] = []
  for (const file of images) {
    newContent.push({
      type: MessageContentType.Image,
      file,
      mediaType: 'image/png',
      fileName: file.name,
    })
  }

  if (input) {
    newContent.push({
      type: MessageContentType.Text,
      content: input,
    })
  }
  return newContent
}
