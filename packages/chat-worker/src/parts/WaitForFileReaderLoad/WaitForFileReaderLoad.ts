export const waitForFileReaderLoder = async (reader: FileReader): Promise<void> => {
  const { resolve, promise } = Promise.withResolvers<any>()
  reader.addEventListener('loadend', resolve, { once: true })
  await promise
}
