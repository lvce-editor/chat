import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

export const handleRemoveImage = async (id: number) => {
  await WebViewStates.update(id, {
    images: [],
    previewImageUrl: '',
  })
}
