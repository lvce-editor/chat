export const getChatResponseOpenRouter = async (
  formattedMessages: readonly any[],
  apiKey: string,
  modelId: string,
  url: string,
  stream: boolean,
  maxTokens: number,
  tools: readonly any[],
): Promise<Response> => {
  const body: any = {
    max_tokens: maxTokens,
    messages: formattedMessages,
    model: modelId,
    stream,
  }
  if (tools.length > 0) {
    body.tools = tools
  }
  return fetch(url, {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://lvce-editor.github.io',
      'X-Title': 'LVCE Editor Chat',
    },
    method: 'POST',
  })
}
