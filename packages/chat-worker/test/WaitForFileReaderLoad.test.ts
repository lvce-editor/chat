/**
 * @jest-environment jsdom
 */
import { test, expect } from '@jest/globals'
import * as WaitForFileReaderLoad from '../src/parts/WaitForFileReaderLoad/WaitForFileReaderLoad.ts'

test('waits for FileReader to complete loading', async () => {
  const reader = new FileReader()
  const blob = new Blob(['test data'])
  const promise = WaitForFileReaderLoad.waitForFileReaderLoad(reader)

  reader.readAsText(blob)

  await promise
  expect(reader.result).toBe('test data')
})

test('waits for FileReader to complete loading with different data types', async () => {
  const reader = new FileReader()
  const imageData = new Uint8Array([0xff, 0xd8, 0xff]) // Simple JPEG header
  const blob = new Blob([imageData], { type: 'image/jpeg' })
  const promise = WaitForFileReaderLoad.waitForFileReaderLoad(reader)

  reader.readAsArrayBuffer(blob)

  await promise
  expect(reader.result).toBeInstanceOf(ArrayBuffer)
})
