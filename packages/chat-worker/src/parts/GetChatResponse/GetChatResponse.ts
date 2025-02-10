export const getChatResponse = async (message, apiKey, modelId, url, anthropicVersion) => {
  // TODO move networking into separate web worker
  try {
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
    const result = await response.json()
    const content = result.content
    console.log({ content })
  } catch (error) {
    return `${error}`
  }
  return 'test'
}
