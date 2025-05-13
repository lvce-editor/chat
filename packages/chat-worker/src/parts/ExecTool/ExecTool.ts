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

const insertSimpleBrowserCss = async (params) => {
  if (!params.css) {
    throw new Error('css is required')
  }
  await Rpc.invoke('WebView.executeExternalCommand', 'SimpleBrowser.insertCss', params.css)
  return {
    type: 'simple-browser-css-was-applied',
  }
}

const insertSimpleBrowserJavaScript = async (params) => {
  if (!params.code) {
    throw new Error('code is required')
  }
  await Rpc.invoke('WebView.executeExternalCommand', 'SimpleBrowser.insertJavaScript', params.code)
  return {
    type: 'simple-browser-javascript-was-applied',
  }
}
const layoutToggleSideBar = async () => {
  await Rpc.invoke('WebView.executeExternalCommand', 'Layout.toggleSideBar')
  return {
    type: 'command-executed-successfully',
  }
}

const helpShowAbout = async () => {
  await Rpc.invoke('WebView.executeExternalCommand', 'About.showAbout')
  return {
    type: 'command-executed-successfully',
  }
}

export const execTool = async (toolName: string, params: any): Promise<any> => {
  if (toolName === 'set_simple_browser_url') {
    return execSimpleBrowserTool(params)
  }
  if (toolName === 'get_simple_browser_dom_tree') {
    return getSimpleBrowserDomTree(params)
  }
  if (toolName === 'simple_browser_insert_css') {
    return insertSimpleBrowserCss(params)
  }
  if (toolName === 'simple_browser_insert_javascript') {
    return insertSimpleBrowserJavaScript(params)
  }
  if (toolName === 'layout_toggle_side_bar') {
    return layoutToggleSideBar()
  }
  if (toolName === 'help_show_about') {
    return helpShowAbout()
  }
  console.warn(`unsupported tool ${toolName}`)
}
