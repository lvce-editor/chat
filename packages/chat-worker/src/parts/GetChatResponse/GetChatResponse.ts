export const getChatResponse = async (
  formattedMessages: any[],
  apiKey: string,
  modelId: string,
  url: string,
  anthropicVersion: string,
  stream: boolean,
  maxTokens: number,
): Promise<Response> => {
  return fetch(url, {
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
}
