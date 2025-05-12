import * as Rpc from '../Rpc/Rpc.ts'

const execSimpleBrowserTool = async (params) => {
  if (!params.url) {
    throw new Error('url is required')
  }
  await Rpc.invoke('WebView.executeExternalCommand', 'SimpleBrowser.setUrl', params.url)
  return {
    type: 'navigation-successful',
  }
}

const getSimpleBrowserDomTree = async (params) => {
  const result = await Rpc.invoke('WebView.executeExternalCommand', 'SimpleBrowser.getDomTree')
  return {
    type: 'simple-browser-dom',
    html: result,
  }
}

export const execTool = async (toolName: string, params: any): Promise<any> => {
  if (toolName === 'set_simple_browser_url') {
    return execSimpleBrowserTool(params)
  }
  if (toolName === 'get_simple_browser_dom_tree') {
    return getSimpleBrowserDomTree(params)
  }
}
