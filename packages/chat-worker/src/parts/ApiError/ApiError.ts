export class ApiError extends Error {
  constructor(message: string, code: string) {
    super(`${code}: ${message}`)
    this.name = 'ApiError'
  }
}
