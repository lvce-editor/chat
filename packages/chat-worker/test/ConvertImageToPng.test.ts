/**
 * @jest-environment jsdom
 */
import { test, expect, jest, beforeEach } from '@jest/globals'
import * as ConvertImageToPng from '../src/parts/ConvertImageToPng/ConvertImageToPng.ts'

const mockConvertToBlob = jest.fn()
const mockGetContext = jest.fn()

class MockOffscreenCanvas {
  constructor(
    public width: number,
    public height: number,
  ) {}
  getContext() {
    return mockGetContext()
  }
  convertToBlob(options: any) {
    return mockConvertToBlob(options)
  }
}

// @ts-ignore
globalThis.OffscreenCanvas = MockOffscreenCanvas
// @ts-ignore
globalThis.createImageBitmap = jest.fn().mockResolvedValue({
  width: 100,
  height: 100,
})

beforeEach(() => {
  mockConvertToBlob.mockReset()
  mockGetContext.mockReset()
  // @ts-ignore
  globalThis.createImageBitmap.mockClear()
})

test('keeps PNG files unchanged', async () => {
  const originalFile = new File(['test'], 'test.png', { type: 'image/png' })
  const result = await ConvertImageToPng.convertImageToPng(originalFile)
  expect(result.type).toBe('image/png')
  expect(result.name).toBe('test.png')
})

test('converts JPEG to PNG', async () => {
  const mockCtx = {
    drawImage: jest.fn(),
  }
  mockGetContext.mockReturnValue(mockCtx)
  // @ts-ignore
  mockConvertToBlob.mockResolvedValue(new Blob(['test'], { type: 'image/png' }))

  const jpegFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
  const result = await ConvertImageToPng.convertImageToPng(jpegFile)

  expect(result.type).toBe('image/png')
  expect(result.name).toBe('test.png')
  expect(mockCtx.drawImage).toHaveBeenCalled()
  expect(mockConvertToBlob).toHaveBeenCalledWith({ type: 'image/png' })
})

test('throws error when canvas context is null', async () => {
  mockGetContext.mockReturnValue(null)
  const jpegFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

  await expect(ConvertImageToPng.convertImageToPng(jpegFile)).rejects.toThrow('Failed to get canvas context')
})
