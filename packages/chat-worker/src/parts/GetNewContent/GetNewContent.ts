import type { MessageContent } from '../MessageContent/MessageContent.ts'

export const getNewContent = (input: string, images: readonly File[]): readonly MessageContent[] => {
  const newContent: MessageContent[] = []
  for (const file of images) {
    newContent.push({
      type: 'image',
      file,
      mediaType: 'image/png',
      fileName: file.name,
    })
  }

  if (input) {
    newContent.push({
      type: 'text',
      content: input,
    })
  }
  return newContent
}
