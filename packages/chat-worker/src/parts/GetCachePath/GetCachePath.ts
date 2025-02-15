export const getCachePath = (cacheBaseUrl: string, fileName: string): string => {
  const url = `${cacheBaseUrl}/${fileName}`
  return url
}
