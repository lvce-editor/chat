import * as Update from '../Update/Update.ts'

export const handleNewChat = async (id: number) => {
  await Update.update(id, {
    messages: [],
    currentInput: '',
    images: [],
    previewImageUrl: '',
  })
}
