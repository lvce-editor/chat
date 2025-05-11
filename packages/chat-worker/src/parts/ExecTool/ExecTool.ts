import * as Rpc from '../Rpc/Rpc.ts'

const execSimpleBrowserTool = async (params) => {
  if (!params.url) {
    throw new Error('url is required')
  }
  await Rpc.invoke('Command.execute', 'SimpleBrowser.setUrl', params.url)
}

export const execTool = async (toolName: string, params: any): Promise<any> => {
  if (toolName === 'set_simple_browser_url') {
    return execSimpleBrowserTool(params)
  }
}
