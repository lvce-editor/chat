import * as Models from '../Models/Models.ts'

// TODO make all of these configurable

export const getApiKey = async (rpc: any): Promise<string> => {
  const apiKey = await rpc.invoke('WebView.getSecret', 'secrets.claude')
  return apiKey
}

export const getOpenRouterApiKey = async (rpc: any): Promise<string> => {
  const apiKey = await rpc.invoke('WebView.getSecret', 'secrets.openrouter')
  return apiKey
}

export const getModelProvider = async (rpc: any): Promise<string> => {
  const modelProvider = (await rpc.invoke('WebView.getSecret', 'chat.modelProvider')) || 'anthropic'
  return modelProvider
}

export const getModelId = async (rpc: any): Promise<string> => {
  const modelId = (await rpc.invoke('WebView.getSecret', 'claude.modelId')) || Models.defaultId
  return modelId
}

export const getModelName = async (modelId: string): Promise<string> => {
  const match = Models.models.find((item) => item.id === modelId)
  if (!match) {
    return ''
  }
  return match.name
}

export const getUrl = (modelProvider: string): string => {
  if (modelProvider === 'openrouter') {
    return 'https://openrouter.ai/api/v1/chat/completions'
  }
  return 'https://api.anthropic.com/v1/messages'
}

export const getAnthropicVersion = (): string => {
  const anthropicVersion = '2023-06-01'
  return anthropicVersion
}

export const getMaxTokens = (): number => {
  const maxTokens = 1024
  return maxTokens
}

export const getCacheName = (): string => {
  const cacheName = 'chat-image-cache'
  return cacheName
}

export const getCacheBaseUrl = (): string => {
  const cacheBaseUrl = 'https://example.com'
  return cacheBaseUrl
}
