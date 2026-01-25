import { test, expect } from '@jest/globals'
import * as OpenRouterEventStream from '../src/parts/OpenRouterEventStream/OpenRouterEventStream.ts'

test('parses OpenRouter event stream data', async () => {
  const encoder = new TextEncoder()
  const input = `data: {"choices":[{"delta":{"content":"Hello"}}]}\n\ndata: {"choices":[{"delta":{"content":" World"}}]}\n\n`
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(input))
      controller.close()
    },
  })

  const result = OpenRouterEventStream.openRouterEventStream(stream)
  const chunks: any[] = []
  const reader = result.getReader()

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    chunks.push(value)
  }

  expect(chunks).toEqual([
    { choices: [{ delta: { content: 'Hello' } }] },
    { choices: [{ delta: { content: ' World' } }] },
  ])
})

test('ignores non-data lines in OpenRouter stream', async () => {
  const encoder = new TextEncoder()
  const input = `: keep-alive\ndata: {"choices":[{"delta":{"content":"Hello"}}]}\n\nevent: message\ndata: {"choices":[{"delta":{"content":" World"}}]}\n\n`

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(input))
      controller.close()
    },
  })

  const result = OpenRouterEventStream.openRouterEventStream(stream)
  const chunks: any[] = []
  const reader = result.getReader()

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    chunks.push(value)
  }

  expect(chunks).toEqual([
    { choices: [{ delta: { content: 'Hello' } }] },
    { choices: [{ delta: { content: ' World' } }] },
  ])
})

test('handles [DONE] marker in OpenRouter stream', async () => {
  const encoder = new TextEncoder()
  const input = `data: {"choices":[{"delta":{"content":"Test"}}]}\n\ndata: [DONE]\n\n`

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(input))
      controller.close()
    },
  })

  const result = OpenRouterEventStream.openRouterEventStream(stream)
  const chunks: any[] = []
  const reader = result.getReader()

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    chunks.push(value)
  }

  expect(chunks).toEqual([{ choices: [{ delta: { content: 'Test' } }] }])
})

test('parses tool calls in OpenRouter stream', async () => {
  const encoder = new TextEncoder()
  const toolCallChunk = {
    choices: [
      {
        delta: {
          tool_calls: [
            {
              function: {
                arguments: '{"location":"SF"}',
                name: 'get_weather',
              },
              id: 'call_123',
              type: 'function',
            },
          ],
        },
      },
    ],
  }
  const input = `data: ${JSON.stringify(toolCallChunk)}\n\ndata: [DONE]\n\n`

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(input))
      controller.close()
    },
  })

  const result = OpenRouterEventStream.openRouterEventStream(stream)
  const chunks: any[] = []
  const reader = result.getReader()

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    chunks.push(value)
  }

  expect(chunks).toEqual([toolCallChunk])
})
