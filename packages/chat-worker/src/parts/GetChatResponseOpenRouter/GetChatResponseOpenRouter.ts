const convertToolsToOpenAiFormat = (tools: readonly any[]): any[] => {
  return tools.map((tool) => {
    // If already in OpenAI format, return as is
    if (tool.type === 'function' && tool.function) {
      return tool
    }
    // Convert from Anthropic format to OpenAI format
    return {
      function: {
        description: tool.description,
        name: tool.name,
        parameters: tool.input_schema,
      },
      type: 'function',
    }
  })
}

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
    body.tools = convertToolsToOpenAiFormat(tools)
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
