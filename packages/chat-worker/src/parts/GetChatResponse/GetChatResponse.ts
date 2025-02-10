export const getChatResponse = async (message, apiKey, modelId, url, anthropicVersion) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': anthropicVersion,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: modelId,
      max_tokens: 1024,
      messages: [{ role: 'user', content: message }],
    }),
  })
  const result = await response.json()
  const content = result.content
  console.log({ content })

  return 'test'
}
