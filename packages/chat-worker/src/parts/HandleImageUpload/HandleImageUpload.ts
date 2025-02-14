import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleImageUpload = async (id: number, imageData: { type: string; data: string }) => {
  const webView = WebViewStates.get(id)
  // @ts-ignore
  const blob = new Blob([atob(imageData.data)], { type: imageData.data.type })
  const blobUrl = URL.createObjectURL(blob)

  const formContent = createFormContent(blobUrl)
  await webView.port.invoke('updateForm', formContent)
}

const createFormContent = (blobUrl: string): any => {
  // Similar to the form content in Create.ts but with image preview
  // Reference lines from Create.ts:
  // startLine: 34
  // endLine: 88
}
