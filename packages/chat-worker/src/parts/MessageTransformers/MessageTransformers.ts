import { v4 as uuid } from 'uuid'
import type {
  StoredMessage,
  ApiMessage,
  DisplayMessage,
  MessageContent,
  ApiContent,
  DisplayBlock,
} from '../MessageTypes/MessageTypes.ts'
import * as ToBase64 from '../ToBase64/ToBase64.ts'

// Convert UI input to stored message
export const createStoredMessage = async (input: string, images: File[]): Promise<StoredMessage> => {
  const content: MessageContent[] = []

  // Convert images to base64 and add as content
  for (const file of images) {
    const base64Data = await ToBase64.toBase64(file)
    content.push({
      type: 'image',
      base64Data,
      mediaType: file.type,
    })
  }

  // Add text content if present
  if (input) {
    content.push({
      type: 'text',
      text: input,
    })
  }

  return {
    id: uuid(),
    role: 'human',
    timestamp: Date.now(),
    content,
  }
}

// Convert stored message to API format
export const toApiMessage = (stored: StoredMessage): ApiMessage => {
  const content: ApiContent[] = stored.content.map((block) => {
    if (block.type === 'image') {
      return {
        type: 'image',
        source: {
          type: 'base64',
          media_type: block.mediaType,
          data: block.base64Data,
        },
      }
    }
    if (block.type === 'code') {
      return {
        type: 'text',
        text: block.code,
      }
    }
    return {
      type: 'text',
      text: block.text,
    }
  })

  return {
    role: stored.role === 'human' ? 'user' : 'assistant',
    content,
  }
}

// Convert stored message to display format
export const toDisplayMessage = (stored: StoredMessage): DisplayMessage => {
  const blocks: DisplayBlock[] = stored.content.map((block) => {
    switch (block.type) {
      case 'text':
        return {
          type: 'text',
          content: block.text,
        }
      case 'code':
        return {
          type: 'code',
          content: block.code,
          language: block.language,
        }
      case 'image':
        // TODO use object url / blob url
        return {
          type: 'image',
          src: `data:${block.mediaType};base64,${block.base64Data}`,
        }
    }
  })

  return {
    id: stored.id,
    role: stored.role,
    blocks,
  }
}

// Parse API response to stored format
export const fromApiResponse = (response: ApiMessage): StoredMessage => {
  const content: MessageContent[] = response.content.map((block) => {
    if (block.type === 'image') {
      return {
        type: 'image',
        base64Data: block.source.data,
        mediaType: block.source.media_type,
      }
    }
    return {
      type: 'text',
      text: block.text,
    }
  })

  return {
    id: uuid(),
    role: response.role === 'user' ? 'human' : 'ai',
    timestamp: Date.now(),
    content,
  }
}
