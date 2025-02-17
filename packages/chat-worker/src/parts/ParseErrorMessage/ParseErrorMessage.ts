export const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const errorData = await response.json()
    if (errorData.error?.message) {
      return errorData.error.message
    }
    return ''
  } catch {
    return response.statusText || 'Unknown error occurred'
    // ignore parse errors
  }
}
