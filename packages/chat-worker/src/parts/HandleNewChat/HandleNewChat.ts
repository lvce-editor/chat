import * as InputSource from '../InputSource/InputSource.ts'
import * as Update from '../Update/Update.ts'

export const handleNewChat = async (id: number) => {
  await Update.update(id, {
    messages: [],
    currentInput: '',
    images: [],
    previewImageUrl: '',
    focused: true,
    inputSource: InputSource.Script,
  })
}
