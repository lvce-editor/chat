export const responseToFile = async (response: Response, fileName: string, mediaType: string): Promise<File> => {
  const blob = await response.blob()
  const file = new File([blob], fileName, {
    type: mediaType,
  })
  return file
}
