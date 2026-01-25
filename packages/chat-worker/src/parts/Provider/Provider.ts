export const Anthropic = 'anthropic'
export const OpenRouter = 'openrouter'

export type Provider = typeof Anthropic | typeof OpenRouter

export const defaultProvider = Anthropic
