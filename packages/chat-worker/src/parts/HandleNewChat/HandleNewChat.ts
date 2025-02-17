import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleNewChat = async (id: number) => {
  await WebViewStates.update(id, {
    messages: [],
    currentInput: '',
    images: [],
    previewImageUrl: '',
  })
}
