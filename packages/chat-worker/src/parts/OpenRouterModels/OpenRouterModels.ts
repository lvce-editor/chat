export const models = [
  {
    default: true,
    id: 'xiaomi/mimo-v2-flash:free',
    name: 'Xiaomi MiMO v2 Flash (Free)',
  },
  {
    id: 'google/gemini-2.0-flash-001',
    name: 'Google Gemini 2.0 Flash',
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B Instruct',
  },
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek Chat',
  },
  {
    id: 'mistralai/mistral-large',
    name: 'Mistral Large',
  },
]

export const defaultId = models.find((model) => model.default)?.id || ''
