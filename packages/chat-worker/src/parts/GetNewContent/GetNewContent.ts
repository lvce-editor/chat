import type { MessageContent } from '../MessageContent/MessageContent.ts'
import * as MessageContentType from '../MessageContentType/MessageContentType.ts'

export const getNewContent = (input: string, images: readonly File[]): readonly MessageContent[] => {
  const newContent: MessageContent[] = []
  for (const file of images) {
    newContent.push({
      file,
      fileName: file.name,
      mediaType: 'image/png',
      type: MessageContentType.Image,
    })
  }

  if (input) {
    newContent.push({
      content: input,
      type: MessageContentType.Text,
    })
  }
  return newContent
}
