export const convertImageToPng = async (file: File): Promise<File> => {
  // If already PNG, return original
  if (file.type === 'image/png') {
    return file
  }

  // Create image bitmap from file
  const bitmap = await createImageBitmap(file)

  // Create offscreen canvas matching image dimensions
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Failed to get canvas context')
  }

  // Draw image to canvas
  ctx.drawImage(bitmap, 0, 0)

  // Convert to PNG blob
  const blob = await canvas.convertToBlob({
    type: 'image/png',
  })

  // Create new file with PNG type
  return new File([blob], file.name.replace(/\.[^/.]+$/, '.png'), {
    type: 'image/png',
  })
}
