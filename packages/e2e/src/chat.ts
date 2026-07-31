import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat'

export const test: Test = async ({ expect, Extension, Locator, Main, WebView }) => {
  await Extension.activateByEvent('onWebView:builtin.chat-view', '', 2)

  // act
  await Main.openUri('test://example.chat')

  // assert
  const webviewElement = Locator('.WebViewIframe')
  await expect(webviewElement).toBeVisible()
  await expect(webviewElement).toHaveAttribute('title', 'Chat')

  // const webView = await WebView.fromId('builtin.chat')
  // const button = webView.locator('.NewChatButton')
  // await expect(button).toBeVisible()
}
