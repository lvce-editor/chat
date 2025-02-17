import { ApiError } from '../ApiError/ApiError.ts'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import { parseErrorMessage } from '../ParseErrorMessage/ParseErrorMessage.ts'

export const unwrapApiResponse = async (response: Response): Promise<ReadableStream<Uint8Array<ArrayBufferLike>>> => {
  if (!response.ok) {
    if (response.status === 401) {
      throw new ApiError('Invalid API key', ErrorCodes.E_INVALID_API_KEY)
    }
    const errorMessage = await parseErrorMessage(response)
    if (errorMessage.includes('does not support image input')) {
      throw new ApiError(errorMessage, ErrorCodes.E_SONNET_HAIKU_MODEL_DOES_NOT_SUPPORT_IMAGE_UPLOAD)
    }
    throw new Error(errorMessage)
  }

  if (!response.body) {
    throw new ApiError('No response body', ErrorCodes.E_NO_RESPONSE_BODY)
  }
  return response.body
}
