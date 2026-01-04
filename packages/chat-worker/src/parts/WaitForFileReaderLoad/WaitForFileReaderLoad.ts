export const waitForFileReaderLoad = async (reader: FileReader): Promise<void> => {
  const { promise, resolve } = Promise.withResolvers<any>()
  reader.addEventListener('loadend', resolve, { once: true })
  await promise
}
