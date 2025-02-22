import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'chat'

export const test: Test = async ({ Main, Locator, expect }) => {
  // act
  await Main.openUri('test://example.chat')

  // assert
  const webview = Locator('.WebViewIframe')
  await expect(webview).toBeVisible()
  await expect(webview).toHaveAttribute('title', 'Chat')
}
