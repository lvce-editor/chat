export const toBase64 = async (file: File): Promise<string> => {
  const reader = new FileReader()
  const { resolve, promise } = Promise.withResolvers<string>()
  reader.onloadend = function () {
    resolve(reader.result as string)
  }
  reader.readAsDataURL(file)
  const base64Raw = await promise
  const needle = 'base64,'
  const index = base64Raw.indexOf(needle)
  const base64 = base64Raw.slice(index + needle.length)
  return base64
}
