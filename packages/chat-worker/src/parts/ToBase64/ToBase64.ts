import * as WaitForFileReaderToLoad from '../WaitForFileReaderLoad/WaitForFileReaderLoad.ts'

export const toBase64 = async (file: Blob): Promise<string> => {
  const reader = new FileReader()
  const promise = WaitForFileReaderToLoad.waitForFileReaderLoder(reader)
  reader.readAsDataURL(file)
  await promise
  const base64Raw = reader.result as string
  const needle = 'base64,'
  const index = base64Raw.indexOf(needle)
  const base64 = base64Raw.slice(index + needle.length)
  return base64
}
