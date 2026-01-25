import { test, expect } from '@jest/globals'
import * as OpenRouterModels from '../src/parts/OpenRouterModels/OpenRouterModels.ts'

test('models - has default model', () => {
  const defaultModel = OpenRouterModels.models.find((model) => model.default)
  expect(defaultModel).toBeDefined()
  expect(defaultModel?.id).toBe('xiaomi/mimo-vl-7b-rl:free')
  expect(defaultModel?.name).toBe('Xiaomi MiMO v2 Flash (Free)')
})

test('defaultId - returns the default model id', () => {
  expect(OpenRouterModels.defaultId).toBe('xiaomi/mimo-vl-7b-rl:free')
})

test('models - contains expected models', () => {
  const modelIds = OpenRouterModels.models.map((m) => m.id)
  expect(modelIds).toContain('xiaomi/mimo-vl-7b-rl:free')
  expect(modelIds).toContain('google/gemini-2.0-flash-001')
  expect(modelIds).toContain('anthropic/claude-3.5-sonnet')
  expect(modelIds).toContain('openai/gpt-4o')
})

test('models - all models have id and name', () => {
  for (const model of OpenRouterModels.models) {
    expect(model.id).toBeDefined()
    expect(model.id.length).toBeGreaterThan(0)
    expect(model.name).toBeDefined()
    expect(model.name.length).toBeGreaterThan(0)
  }
})
