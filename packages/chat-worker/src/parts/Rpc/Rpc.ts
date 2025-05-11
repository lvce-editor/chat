export const invoke = async (method: string, ...params: any[]): Promise<any> => {
  // @ts-ignore
  const { rpc } = globalThis
  const url = await rpc.invoke(method, ...params)
  return url
}
