import { test, expect } from '@jest/globals'
import * as EventStream from '../src/parts/EventStream/EventStream.ts'

test('parses event stream data', async () => {
  const encoder = new TextEncoder()
  const input = `data: {"type":"content_block_delta","delta":{"text":"Hello"}}\n\ndata: {"type":"content_block_delta","delta":{"text":" World"}}\n\n`
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(input))
      controller.close()
    },
  })

  const result = EventStream.eventStream(stream)
  const chunks: Uint8Array[] = []
  const reader = result.getReader()

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    chunks.push(value)
  }

  expect(chunks).toEqual([
    {
      type: 'content_block_delta',
      delta: {
        text: 'Hello',
      },
    },
    {
      type: 'content_block_delta',
      delta: {
        text: ' World',
      },
    },
  ])
})

test('ignores non-data lines', async () => {
  const encoder = new TextEncoder()
  const input = `
: keep-alive
data: {"type":"content_block_delta","delta":{"text":"Hello"}}\n\n
event: message
data: {"type":"content_block_delta","delta":{"text":" World"}}\n\n`

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(input))
      controller.close()
    },
  })

  const result = EventStream.eventStream(stream)
  const chunks: Uint8Array[] = []
  const reader = result.getReader()

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    chunks.push(value)
  }

  expect(chunks).toEqual([
    {
      type: 'content_block_delta',
      delta: {
        text: 'Hello',
      },
    },
    {
      type: 'content_block_delta',
      delta: {
        text: ' World',
      },
    },
  ])
})

test('handles empty input', async () => {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(''))
      controller.close()
    },
  })

  const result = EventStream.eventStream(stream)
  const chunks: Uint8Array[] = []
  const reader = result.getReader()

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    chunks.push(value)
  }

  expect(chunks).toEqual([])
})
