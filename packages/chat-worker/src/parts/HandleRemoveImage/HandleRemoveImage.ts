import * as WebViewStates from '../WebViewStates/WebViewStates.ts'
import { createFormContent } from '../CreateFormContent/CreateFormContent.ts'

export const handleRemoveImage = async (id: number) => {
  const webView = WebViewStates.get(id)
  const formContent = createFormContent()
  await webView.port.invoke('updateForm', formContent)
}
