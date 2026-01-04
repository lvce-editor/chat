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
    currentInput: '',
    focused: false,
    images: [],
    imageUrlCache: new Map(),
    inputSource: InputSource.User,
    isScrolledToBottom: false,
    maxTokens: 0,
    messages: [],
    modelId: '',
    modelName: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    tools: [],
    url: '',
  }
  const newWebView: WebView = {
    anthropicVersion: '',
    apiKey: '',
    cacheBaseUrl: '',
    cacheName: '',
    currentInput: '',
    focused: false,
    images: [],
    imageUrlCache: new Map(),
    inputSource: InputSource.User,
    isScrolledToBottom: false,
    maxTokens: 0,
    messages: [],
    modelId: '',
    modelName: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    tools: [],
    url: '',
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
    currentInput: '',
    focused: false,
    images: [],
    imageUrlCache: new Map(),
    inputSource: InputSource.User,
    isScrolledToBottom: false,
    maxTokens: 0,
    messages: [],
    modelId: '',
    modelName: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    tools: [],
    url: '',
  }
  const newWebView: WebView = {
    anthropicVersion: '',
    apiKey: '',
    cacheBaseUrl: '',
    cacheName: '',
    currentInput: '',
    focused: false,
    images: [],
    imageUrlCache: new Map(),
    inputSource: InputSource.User,
    isScrolledToBottom: false,
    maxTokens: 0,
    messages: [],
    modelId: '',
    modelName: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    tools: [],
    url: '',
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
    currentInput: '',
    focused: false,
    images: [],
    imageUrlCache: new Map(),
    inputSource: InputSource.Script,
    isScrolledToBottom: false,
    maxTokens: 0,
    messages: [],
    modelId: '',
    modelName: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    tools: [],
    url: '',
  }
  const newWebView: WebView = {
    anthropicVersion: '',
    apiKey: '',
    cacheBaseUrl: '',
    cacheName: '',
    currentInput: 'Hello',
    focused: false,
    images: [],
    imageUrlCache: new Map(),
    inputSource: InputSource.Script,
    isScrolledToBottom: false,
    maxTokens: 0,
    messages: [],
    modelId: '',
    modelName: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    tools: [],
    url: '',
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
    currentInput: '',
    focused: false,
    images: [],
    imageUrlCache: new Map(),
    inputSource: InputSource.Script,
    isScrolledToBottom: false,
    maxTokens: 0,
    messages: [],
    modelId: '',
    modelName: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    tools: [],
    url: '',
  }
  const newWebView: WebView = {
    anthropicVersion: '',
    apiKey: '',
    cacheBaseUrl: '',
    cacheName: '',
    currentInput: '',
    focused: true,
    images: [],
    imageUrlCache: new Map(),
    inputSource: InputSource.Script,
    isScrolledToBottom: false,
    maxTokens: 0,
    messages: [],
    modelId: '',
    modelName: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    tools: [],
    url: '',
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
    currentInput: '',
    focused: false,
    images: [],
    imageUrlCache: new Map(),
    inputSource: InputSource.Script,
    isScrolledToBottom: false,
    maxTokens: 0,
    messages: [],
    modelId: '',
    modelName: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    tools: [],
    url: '',
  }
  const newWebView: WebView = {
    anthropicVersion: '',
    apiKey: '',
    cacheBaseUrl: '',
    cacheName: '',
    currentInput: 'Hello',
    focused: true,
    images: [],
    imageUrlCache: new Map(),
    inputSource: InputSource.Script,
    isScrolledToBottom: false,
    maxTokens: 0,
    messages: [],
    modelId: '',
    modelName: '',
    port: 0,
    previewImageUrl: '',
    scrollOffset: 0,
    stream: false,
    time: 0,
    tools: [],
    url: '',
  }
  const diffs = [DiffType.Dom, DiffType.InputValue, DiffType.Focus]

  const result = await GetRenderCommands.getRenderCommands(oldWebView, newWebView, diffs)
  expect(result).toEqual([['render', expect.any(Object)], ['setValue', 'Input', 'Hello'], ['focusInput']])
})
