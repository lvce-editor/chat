export const getResponse = async (url: string, options: any): Promise<any> => {
  const response = await fetch(url, options)
  return {
    ok: response.ok,
    status: response.status,
    body: response.body,
  }
}
