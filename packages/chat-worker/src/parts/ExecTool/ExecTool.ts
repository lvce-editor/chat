import { executeExternalCommand } from '../ExecuteExternalCommand/ExecuteExternalCommand.ts'
import * as Rpc from '../Rpc/Rpc.ts'

const execSimpleBrowserTool = async (params) => {
  if (!params.url) {
    throw new Error('url is required')
  }
  await executeExternalCommand('SimpleBrowser.setUrl', params.url)
  return {
    type: 'navigation-successful',
  }
}

const getSimpleBrowserDomTree = async (params) => {
  const result = await executeExternalCommand('SimpleBrowser.getDomTree')
  const limit = params?.maxLength || 10_000
  const sliced = result.slice(0, limit)
  return {
    type: 'simple-browser-dom',
    html: sliced,
  }
}

const insertSimpleBrowserCss = async (params) => {
  if (!params.css) {
    throw new Error('css is required')
  }
  await executeExternalCommand('SimpleBrowser.insertCss', params.css)
  return {
    type: 'simple-browser-css-was-applied',
  }
}

const insertSimpleBrowserJavaScript = async (params) => {
  if (!params.code) {
    throw new Error('code is required')
  }
  await executeExternalCommand('SimpleBrowser.insertJavaScript', params.code)
  return {
    type: 'simple-browser-javascript-was-applied',
  }
}
const layoutToggleSideBar = async () => {
  await executeExternalCommand('Layout.toggleSideBar')
  return {
    type: 'command-executed-successfully',
  }
}

const layoutTogglePanel = async () => {
  await executeExternalCommand('Layout.togglePanel')
  return {
    type: 'command-executed-successfully',
  }
}

const layoutShowSourceControl = async () => {
  await executeExternalCommand('SideBar.openViewlet', 'Source Control')
  return {
    type: 'command-executed-successfully',
  }
}

const layoutShowSearch = async () => {
  await executeExternalCommand('SideBar.openViewlet', 'Search')
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

const explorerCollapseAll = async () => {
  await Rpc.invoke('WebView.executeExternalCommand', 'Explorer.collapseAll')
  return {
    type: 'command-executed-successfully',
  }
}
const explorerNewFile = async () => {
  await Rpc.invoke('WebView.executeExternalCommand', 'Explorer.newFile')
  return {
    type: 'command-executed-successfully',
  }
}
const explorerUpdateEditingValue = async ({ value }: { value: string }) => {
  await Rpc.invoke('WebView.executeExternalCommand', 'Explorer.updateEditingValue', value)
  return {
    type: 'command-executed-successfully',
  }
}
const explorerAcceptEdit = async () => {
  await Rpc.invoke('WebView.executeExternalCommand', 'Explorer.acceptEdit')
  return {
    type: 'command-executed-successfully',
  }
}

const quickPickOpenRecent = async () => {
  await Rpc.invoke('WebView.executeExternalCommand', 'QuickPick.openRecent')
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
  if (toolName === 'explorer_collapse_all') {
    return explorerCollapseAll()
  }
  if (toolName === 'quickpick_open_recent') {
    return quickPickOpenRecent()
  }
  if (toolName === 'layout_toggle_panel') {
    return layoutTogglePanel()
  }
  if (toolName === 'layout_show_source_control') {
    return layoutShowSourceControl()
  }
  if (toolName === 'layout_show_search') {
    return layoutShowSearch()
  }
  if (toolName === 'explorer_new_file') {
    return explorerNewFile()
  }
  if (toolName === 'explorer_update_editing_value') {
    return explorerUpdateEditingValue(params)
  }
  if (toolName === 'explorer_accept_edit') {
    return explorerAcceptEdit()
  }
  console.warn(`unsupported tool ${toolName}`)
}
