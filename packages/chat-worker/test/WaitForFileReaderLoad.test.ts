/**
 * @jest-environment jsdom
 */
import { test, expect } from '@jest/globals'
import * as WaitForFileReaderLoad from '../src/parts/WaitForFileReaderLoad/WaitForFileReaderLoad.ts'

test('waits for FileReader to complete loading', async () => {
  const reader = new FileReader()
  const blob = new Blob(['test data'])
  const promise = WaitForFileReaderLoad.waitForFileReaderLoad(reader)

  reader.readAsDataURL(blob)

  await promise
  expect(reader.result).toBe('data:application/octet-stream;base64,dGVzdCBkYXRh')
})
