export const unwrapApiResponse = async (response: Response): Promise<ReadableStream<Uint8Array<ArrayBufferLike>>> => {
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('invalid api key')
    }

    let errorMessage = response.statusText || 'Unknown error occurred'

    try {
      const errorData = await response.json()
      if (errorData.error?.message) {
        errorMessage = errorData.error.message
      }
    } catch {
      // ignore parse errors
    }

    throw new Error(errorMessage)
  }

  if (!response.body) {
    throw new Error('no response body')
  }
  return response.body
}
