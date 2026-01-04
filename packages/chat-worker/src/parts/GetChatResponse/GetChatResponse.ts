export const getChatResponse = async (
  formattedMessages: readonly any[],
  apiKey: string,
  modelId: string,
  url: string,
  anthropicVersion: string,
  stream: boolean,
  maxTokens: number,
  tools: readonly any[],
): Promise<Response> => {
  return fetch(url, {
    body: JSON.stringify({
      max_tokens: maxTokens,
      messages: formattedMessages,
      model: modelId,
      stream,
      tools,
    }),
    headers: {
      'anthropic-dangerous-direct-browser-access': 'true', // https://github.com/anthropics/anthropic-sdk-typescript/pull/504#issuecomment-2306060472
      'anthropic-version': anthropicVersion,
      'content-type': 'application/json',
      'x-api-key': apiKey,
    },
    method: 'POST',
  })
}
