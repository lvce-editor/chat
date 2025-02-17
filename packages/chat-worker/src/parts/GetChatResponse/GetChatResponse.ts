export const getChatResponse = async (
  formattedMessages: any[],
  apiKey: string,
  modelId: string,
  url: string,
  anthropicVersion: string,
  stream: boolean,
  maxTokens: number,
): Promise<ReadableStream<Uint8Array<ArrayBufferLike>>> => {
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
      max_tokens: maxTokens,
      messages: formattedMessages,
      stream,
    }),
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('invalid api key')
    }

    let errorMessage = response.statusText || 'Unknown error occurred'

    try {
      const errorData = await response.json()
      if (errorData.error?.message) {
        errorMessage = errorData.error.message
      }
    } catch {
      // ignore
    }

    throw new Error(errorMessage)
  }

  if (!response.body) {
    throw new Error('no response body')
  }
  return response.body
}
