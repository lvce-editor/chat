import * as Rpc from '../Rpc/Rpc.ts'

export const executeExternalCommand = async (commandId: string, ...args: readonly any[]): Promise<any> => {
  return Rpc.invoke('WebView.executeExternalCommand', commandId, ...args)
}
