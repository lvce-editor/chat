import * as EventStream from '../EventStream/EventStream.ts'

export const getChatResponseStream = async (
  message: string,
  apiKey: string,
  modelId: string,
  url: string,
  anthropicVersion: string,
) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': anthropicVersion,
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true', // https://github.com/anthropics/anthropic-sdk-typescript/pull/504#issuecomment-2306060472
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: 1024,
      messages: [{ role: 'user', content: message }],
    }),
  })
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('invalid api key')
    }
    throw new Error(response.statusText)
  }

  if (!response.body) {
    throw new Error('no response body')
  }

  return EventStream.eventStream(response.body)
}
