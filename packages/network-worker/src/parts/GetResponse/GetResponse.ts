export const getResponse = async (url: string, options: any): Promise<any> => {
  const response = await fetch(url, options)
  return {
    body: response.body,
    ok: response.ok,
    status: response.status,
  }
}
