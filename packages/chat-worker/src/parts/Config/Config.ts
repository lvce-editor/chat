import * as Models from '../Models/Models.ts'
import * as OpenRouterModels from '../OpenRouterModels/OpenRouterModels.ts'
import * as Provider from '../Provider/Provider.ts'

// TODO make all of these configurable

export const getProvider = async (rpc: any): Promise<Provider.Provider> => {
  const provider = (await rpc.invoke('WebView.getSecret', 'ai.provider')) || Provider.defaultProvider
  console.log({ provider })
  return provider as Provider.Provider
}

export const getApiKey = async (rpc: any): Promise<string> => {
  const apiKey = await rpc.invoke('WebView.getSecret', 'secrets.claude')
  return apiKey
}

export const getOpenRouterApiKey = async (rpc: any): Promise<string> => {
  const apiKey = await rpc.invoke('WebView.getSecret', 'secrets.openrouter')
  return apiKey
}

export const getModelId = async (rpc: any): Promise<string> => {
  const modelId = (await rpc.invoke('WebView.getSecret', 'claude.modelId')) || Models.defaultId
  return modelId
}

export const getOpenRouterModelId = async (rpc: any): Promise<string> => {
  const modelId = (await rpc.invoke('WebView.getSecret', 'openrouter.modelId')) || OpenRouterModels.defaultId
  return modelId
}

export const getModelName = async (modelId: string): Promise<string> => {
  const match = Models.models.find((item) => item.id === modelId)
  if (!match) {
    return ''
  }
  return match.name
}

export const getOpenRouterModelName = async (modelId: string): Promise<string> => {
  const match = OpenRouterModels.models.find((item) => item.id === modelId)
  if (!match) {
    return ''
  }
  return match.name
}

export const getUrl = (): string => {
  const url = 'https://api.anthropic.com/v1/messages'
  return url
}

export const getOpenRouterUrl = (): string => {
  const url = 'https://openrouter.ai/api/v1/chat/completions'
  return url
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
