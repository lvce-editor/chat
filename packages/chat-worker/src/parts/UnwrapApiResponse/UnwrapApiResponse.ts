import { parseErrorMessage } from '../ParseErrorMessage/ParseErrorMessage.ts'

export const unwrapApiResponse = async (response: Response): Promise<ReadableStream<Uint8Array<ArrayBufferLike>>> => {
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('invalid api key')
    }
    const errorMessage = await parseErrorMessage(response)
    throw new Error(errorMessage)
  }

  if (!response.body) {
    throw new Error('no response body')
  }
  return response.body
}
