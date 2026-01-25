import { test, expect } from '@jest/globals'
import * as Provider from '../src/parts/Provider/Provider.ts'

test('Anthropic - has correct value', () => {
  expect(Provider.Anthropic).toBe('anthropic')
})

test('OpenRouter - has correct value', () => {
  expect(Provider.OpenRouter).toBe('openrouter')
})

test('defaultProvider - is anthropic', () => {
  expect(Provider.defaultProvider).toBe('anthropic')
})
