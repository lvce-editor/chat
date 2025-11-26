export const models = [
  {
    name: 'Claude 4.5',
    id: `claude-sonnet-4-5-20250929`,
  },
  {
    name: 'Claude 4.5 Haiku',
    id: 'claude-haiku-4-5-20251001',
    default: true,
  },
  {
    name: 'Claude 4.5 Opus',
    id: 'claude-opus-4-5-20251101',
  },
  {
    name: 'Claude 3.7 Sonnet',
    id: 'claude-3-7-sonnet-20250219',
  },
  {
    name: 'Claude 3.5 Sonnet',
    id: 'claude-3-5-sonnet-20241022',
  },
  {
    name: 'Claude 3.5 Sonnet (June 2024)',
    id: 'claude-3-5-sonnet-20240620',
  },
  {
    name: 'Claude 3.5 Haiku',
    id: 'claude-3-5-haiku-20241022',
  },
  {
    name: 'Claude 3 Opus',
    id: 'claude-3-opus-20240229',
  },
  {
    name: 'Claude 3 Haiku (March 2024)',
    id: 'claude-3-haiku-20240307',
  },
]

export const defaultId = models.find((model) => model.default)?.id || ''
