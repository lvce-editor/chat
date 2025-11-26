import { test, expect } from '@jest/globals'
import type { WebView } from '../src/parts/WebView/WebView.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as GetRenderCommands from '../src/parts/GetRenderCommands/GetRenderCommands.ts'
import * as InputSource from '../src/parts/InputSource/InputSource.ts'

test('returns empty array when no diffs', async () => {
  const oldWebView: WebView = {
    anthropicVersion: '',
    apiKey: '',
    cacheBaseUrl: '',
    cacheName: '',
    messages: [],
    currentInput: '',
    focused: false,
    inputSource: InputSource.User,
    images: [],
    isScrolledToBottom: false,
    maxTokens: 0,
    modelId: '',
    port: 0,
    previewImageUrl: '',
    imageUrlCache: new Map(),
    scrollOffset: 0,
    stream: false,
    time: 0,
    url: '',
    tools: [],
    modelName: '',
  }
  const newWebView: WebView = {
    anthropicVersion: '',
    apiKey: '',
    cacheBaseUrl: '',
    cacheName: '',
    messages: [],
    currentInput: '',
    focused: false,
    inputSource: InputSource.User,
    images: [],
    imageUrlCache: new Map(),
    isScrolledToBottom: false,
    maxTokens: 0,
    modelId: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    url: '',
    tools: [],
    modelName: '',
  }
  const diffs: number[] = []

  const result = await GetRenderCommands.getRenderCommands(oldWebView, newWebView, diffs)
  expect(result).toEqual([])
})

test('returns render command for DOM diff', async () => {
  const oldWebView: WebView = {
    anthropicVersion: '',
    apiKey: '',
    cacheBaseUrl: '',
    cacheName: '',
    messages: [],
    currentInput: '',
    focused: false,
    inputSource: InputSource.User,
    images: [],
    imageUrlCache: new Map(),
    isScrolledToBottom: false,
    maxTokens: 0,
    modelId: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    url: '',
    tools: [],
    modelName: '',
  }
  const newWebView: WebView = {
    anthropicVersion: '',
    apiKey: '',
    cacheBaseUrl: '',
    cacheName: '',
    messages: [],
    currentInput: '',
    focused: false,
    inputSource: InputSource.User,
    images: [],
    imageUrlCache: new Map(),
    isScrolledToBottom: false,
    maxTokens: 0,
    modelId: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    url: '',
    tools: [],
    modelName: '',
  }
  const diffs = [DiffType.Dom]

  const result = await GetRenderCommands.getRenderCommands(oldWebView, newWebView, diffs)
  expect(result).toEqual([['render', expect.any(Object)]])
})

test('returns setValue command for input value diff', async () => {
  const oldWebView: WebView = {
    anthropicVersion: '',
    apiKey: '',
    cacheBaseUrl: '',
    cacheName: '',
    messages: [],
    currentInput: '',
    focused: false,
    inputSource: InputSource.Script,
    images: [],
    imageUrlCache: new Map(),
    isScrolledToBottom: false,
    maxTokens: 0,
    modelId: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    url: '',
    tools: [],
    modelName: '',
  }
  const newWebView: WebView = {
    anthropicVersion: '',
    apiKey: '',
    cacheBaseUrl: '',
    cacheName: '',
    messages: [],
    currentInput: 'Hello',
    focused: false,
    inputSource: InputSource.Script,
    images: [],
    imageUrlCache: new Map(),
    isScrolledToBottom: false,
    maxTokens: 0,
    modelId: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    url: '',
    tools: [],
    modelName: '',
  }
  const diffs = [DiffType.InputValue]

  const result = await GetRenderCommands.getRenderCommands(oldWebView, newWebView, diffs)
  expect(result).toEqual([['setValue', 'Input', 'Hello']])
})

test('returns focus command for focus diff', async () => {
  const oldWebView: WebView = {
    anthropicVersion: '',
    apiKey: '',
    cacheBaseUrl: '',
    cacheName: '',
    messages: [],
    currentInput: '',
    focused: false,
    inputSource: InputSource.Script,
    images: [],
    imageUrlCache: new Map(),
    isScrolledToBottom: false,
    maxTokens: 0,
    modelId: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    url: '',
    tools: [],
    modelName: '',
  }
  const newWebView: WebView = {
    anthropicVersion: '',
    apiKey: '',
    cacheBaseUrl: '',
    cacheName: '',
    messages: [],
    currentInput: '',
    focused: true,
    inputSource: InputSource.Script,
    images: [],
    imageUrlCache: new Map(),
    isScrolledToBottom: false,
    maxTokens: 0,
    modelId: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    url: '',
    tools: [],
    modelName: '',
  }
  const diffs = [DiffType.Focus]

  const result = await GetRenderCommands.getRenderCommands(oldWebView, newWebView, diffs)
  expect(result).toEqual([['focusInput']])
})

test('returns multiple commands for multiple diffs', async () => {
  const oldWebView: WebView = {
    anthropicVersion: '',
    apiKey: '',
    cacheBaseUrl: '',
    cacheName: '',
    messages: [],
    currentInput: '',
    focused: false,
    inputSource: InputSource.Script,
    images: [],
    imageUrlCache: new Map(),
    isScrolledToBottom: false,
    maxTokens: 0,
    modelId: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    url: '',
    tools: [],
    modelName: '',
  }
  const newWebView: WebView = {
    anthropicVersion: '',
    apiKey: '',
    cacheBaseUrl: '',
    cacheName: '',
    messages: [],
    currentInput: 'Hello',
    focused: true,
    inputSource: InputSource.Script,
    images: [],
    imageUrlCache: new Map(),
    isScrolledToBottom: false,
    maxTokens: 0,
    modelId: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    url: '',
    tools: [],
    modelName: '',
  }
  const diffs = [DiffType.Dom, DiffType.InputValue, DiffType.Focus]

  const result = await GetRenderCommands.getRenderCommands(oldWebView, newWebView, diffs)
  expect(result).toEqual([['render', expect.any(Object)], ['setValue', 'Input', 'Hello'], ['focusInput']])
})
